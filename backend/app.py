import json
import threading
import matplotlib
from flask import Flask, jsonify, request
from flask_cors import CORS
import os

from call_function import voice, text_function
from video_to_wav import delete_file_later

from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
import uuid
from models import db, Video, User
from sqlalchemy.exc import SQLAlchemyError

app = Flask(__name__)

CORS(app, supports_credentials=True)

matplotlib.use('Agg')

# Create database
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
new_db_path = os.path.join(parent_dir, 'ip.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{}'.format(new_db_path)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
with app.app_context():
    db.create_all()
admin = Admin(app, name='Admin', template_mode='bootstrap3')
admin.add_view(ModelView(Video, db.session))
admin.add_view(ModelView(User, db.session))


@app.route('/voice')
def draw():
    user_id = find_user()
    if user_id is not None:
        video = Video.query.filter_by(user_id=user_id).order_by(Video.times.desc()).first()
        if video:
            base64_pitch, base64_intensity, base64_score, title, average_pitch, average_intensity, window_starts, score_f, pitch_average, intensity_average = voice(
                video)
            updates = {
                'user_id': user_id,
                'pitch_image': base64_pitch,
                'intensity_image': base64_intensity,
                'score': score_f,
                'rec_pitch': pitch_average,
                'rec_intensity': intensity_average,
                'average_p': f"{average_pitch :.2f}",
                'average_i': f"{average_intensity: .2f}",
                'time_h': int(window_starts[-1] / 60),
                'time_m': (window_starts[-1] % 60)
            }
            for key, value in updates.items():
                setattr(video, key, value)
                db.session.commit()
            return jsonify({'pitch_image': base64_pitch,
                            'intensity_image': base64_intensity,
                            'score': base64_score,
                            'title': title,
                            'average_p': f"{average_pitch :.2f}",
                            'average_i': f"{average_intensity: .2f}",
                            'time_h': int(window_starts[-1] / 60),
                            'time_m': (window_starts[-1] % 60)})
        else:
            return jsonify({"error": "Video Not Found"})
    # not user
    video_id = request.args.get('uuid')
    if video_id:
        video = Video.query.filter_by(id=video_id).first()
        if video:
            base64_pitch, base64_intensity, base64_score, title, average_pitch, average_intensity, window_starts, _, _, _ = voice(
                video)

            return jsonify({'pitch_image': base64_pitch,
                            'intensity_image': base64_intensity,
                            'score': base64_score,
                            'title': title,
                            'average_p': f"{average_pitch :.2f}",
                            'average_i': f"{average_intensity: .2f}",
                            'time_h': int(window_starts[-1] / 60),
                            'time_m': (window_starts[-1] % 60)})
        else:
            return jsonify({"error": "Video Not Found"})
    else:
        return jsonify({"error": "Video ID Not Found"})


@app.route('/text')
def text():
    user_id = find_user()
    if user_id is not None:
        video = Video.query.filter_by(user_id=user_id).order_by(Video.times.desc()).first()
        if video:
            title, sentence, simple, difficult, simple_list, diff_list, word_plot, speed_picture, length_average, length, average_speed, simple_p, diff_p = text_function(
                video)
            setattr(video, 'user_id', user_id)
            setattr(video, 'transcript', json.dumps(sentence))
            setattr(video, 'simple', json.dumps(simple))
            setattr(video, 'difficult', json.dumps(difficult))
            setattr(video, 'simple_p', simple_p)
            setattr(video, 'diff_p', diff_p)
            setattr(video, 'speed_plot', speed_picture)
            setattr(video, 'sentence_length', length_average)
            setattr(video, 'total_length', length)
            setattr(video, 'average_speed', f"{average_speed: .2f}")
            db.session.commit()
            return jsonify({'title': title,
                            'transcript': sentence,
                            'simple': simple,
                            'difficult': difficult,
                            'simple_show': simple_list,
                            'diff_show': diff_list,
                            'speed_plot': speed_picture,
                            'sentence_length': length_average,
                            'total_length': length,
                            'average_speed': f"{average_speed: .2f}",
                            'word_plot': word_plot
                            })
        else:
            return jsonify({"error": "Video Not Found"})
        # not user
    else:
        video_id = request.args.get('uuid')
        if video_id:
            video = Video.query.filter_by(id=video_id).first()
            if video:
                title, sentence, simple, difficult, simple_list, diff_list, word_plot, speed_picture, length_average, length, average_speed, _, _ = text_function(
                    video)
                updates = {'title': title,
                           'transcript': sentence,
                           'simple': simple,
                           'difficult': difficult,
                           'simple_show': simple_list,
                           'diff_show': diff_list,
                           'speed_plot': speed_picture,
                           'sentence_length': length_average,
                           'total_length': length,
                           'average_speed': f"{average_speed: .2f}",
                           'word_plot': word_plot
                           }
                return jsonify(updates)
            else:
                return jsonify({"error": "Video Not Found"})
        else:
            return jsonify({"error": "Video ID Not Found"})


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'mp4'}


@app.route('/upload', methods=['POST'])
def upload():
    video_uuid = str(uuid.uuid4())
    file = request.files['file']
    gender = request.form.get('gender')
    age = request.form.get('age')

    if file and allowed_file(file.filename):
        filename = file.filename
        save_path = os.path.join('static', filename)
        file.save(save_path)
        user_id = find_user()
        print(user_id)

        if user_id is not None:
            new_video = Video(id=video_uuid, title=filename, gender=gender, age=age, user_id=user_id)
        else:
            new_video = Video(id=video_uuid, title=filename, gender=gender, age=age)
        delay = 7200

        thread = threading.Thread(target=delete_file_later, args=(save_path, delay))
        thread.start()

        try:
            db.session.add(new_video)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            print(str(e))  # 打印异常信息
            return jsonify({"error": "Database commit failed"}), 500

    return jsonify(video_uuid=video_uuid)


@app.route('/delete_video', methods=['POST'])
def delete_video():
    video_uuid = request.json.get('uuid')
    video = Video.query.get(video_uuid)
    if video:
        db.session.delete(video)
        db.session.commit()
        return jsonify({'message': 'Video deleted successfully'}), 200
    return jsonify({'message': 'Video not found'}), 404


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password1 = data.get('password1')
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'email already exists'}), 400
    user = User(username=username, email=email)
    user.set_password(password1)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User successfully registered'}), 200


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    mail = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=mail).first()
    if user and user.check_password(password):
        return jsonify({
            "username": user.username,
            'email': mail
        }), 200

    return jsonify({'message': 'Invalid Username or Password'}), 401


@app.route('/compare', methods=['POST', 'GET'])
def compare():
    user_id = find_user()
    video_id = request.args.get('uuid')
    if user_id is not None:
        videos = Video.query.filter(Video.user_id == user_id, Video.id != video_id).all()
        videos_data = [{
            'id': video.id,
            'title': video.title,
            'upload_time': video.times.strftime('%Y-%m-%d %H:%M:%S') if video.times else None,
            'time_h': video.time_h,
            'time_m': video.time_m,
            'gender': video.gender,
            'age': video.age,
        } for video in videos]
        return jsonify(videos_data), 200
    else:
        return jsonify({"message": "Please log in"}), 403


@app.route('/compare_with')
def compare_with():
    video_id = request.args.get('uuid')
    compare_with_id = request.args.get('compare')
    if video_id and compare_with_id:
        video = Video.query.filter_by(id=video_id).first()
        compare_video = Video.query.filter_by(id=compare_with_id).first()
        compare_data = {
            'video_title': video.title,
            'compare_title': compare_video.title,

            'upload_time_video': video.times.strftime('%Y-%m-%d %H:%M:%S') if video.times else None,
            'upload_time_compare': compare_video.times.strftime('%Y-%m-%d %H:%M:%S') if compare_video.times else None,

            'gender_video': video.gender,
            'gender_compare': compare_video.gender,

            'age_video': video.age,
            'age_compare': compare_video.age,

            'time_h_video': video.time_h,
            'time_m_video': video.time_m,
            'time_h_compare': compare_video.time_h,
            'time_m_compare': compare_video.time_m,

            'score_video': f"{video.score: .2f}",
            'score_compare': f"{compare_video.score: .2f}",

            'avg_p_video': video.average_p,
            'avg_p_compare': compare_video.average_p,

            'rec_p_video': video.rec_pitch,
            'rec_p_compare': compare_video.rec_pitch,

            'avg_i_video': video.average_i,
            'avg_i_compare': compare_video.average_i,

            'rec_i_video': video.rec_intensity,
            'rec_i_compare': compare_video.rec_intensity,

            'p_video_plot': video.pitch_image,
            'p_compare_plot': compare_video.pitch_image,

            'i_video_plot': video.intensity_image,
            'i_compare_plot': compare_video.intensity_image,

            'count_video': video.sentence_length,
            'count_compare': compare_video.sentence_length,

            'total_length_video': video.total_length,
            'total_length_compare': compare_video.total_length,

            'transcript_video': video.transcript,
            'transcript_compare': compare_video.transcript,

            'diff_p_video': f"{video.diff_p: .2f}",
            'diff_p_compare': f"{compare_video.diff_p: .2f}",

            'simple_p_video': f"{video.simple_p: .2f}",
            'simple_p_compare': f"{compare_video.simple_p: .2f}",

            'diff_video': video.difficult,
            'diff_compare': compare_video.difficult,

            'simple_video': video.simple,
            'simple_compare': compare_video.simple,

            'avg_speed_video': video.average_speed,
            'avg_speed_compare': compare_video.average_speed,

            'speed_plot_video': video.speed_plot,
            'speed_plot_compare': compare_video.speed_plot,
        }
        return jsonify(compare_data)
    else:
        jsonify({"error": "no compare id"})


@app.route('/profile')
def profile():
    user_id = find_user()
    if user_id is not None:
        videos = Video.query.filter(Video.user_id == user_id).all()
        videos_data = [{
            'id': video.id,
            'title': video.title,
            'upload_time': video.times.strftime('%Y-%m-%d %H:%M:%S') if video.times else None,
            'time_h': video.time_h,
            'time_m': video.time_m,
            'gender': video.gender,
            'age': video.age,
        } for video in videos]
        return jsonify(videos_data), 200
    else:
        return jsonify({"message": "Please log in"}), 403


@app.route('/profile/delete', methods=['POST'])
def delete_video_by_id():
    data = request.get_json()
    video_id = data.get('videoId')
    email = data.get('email')
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"message": "Please log in"}), 403

    video = Video.query.filter_by(id=video_id, user_id=user.id).first()
    if video:
        db.session.delete(video)
        db.session.commit()
        return jsonify({"message": "Video deleted successfully"}), 200
    else:
        return jsonify({"message": "Video not found"}), 404


def find_user():
    email = request.args.get('email')
    user = User.query.filter_by(email=email).first()
    if user is None:
        return None
    else:
        return user.id


if __name__ == '__main__':
    app.run(debug=True)
