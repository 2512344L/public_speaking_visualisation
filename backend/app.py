import base64
import threading
import time
import uuid
from io import BytesIO

import matplotlib
from flask import Flask, jsonify, request
from flask_cors import CORS
import parselmouth
import matplotlib.pyplot as plt
from matplotlib.patches import Arc
import numpy as np
from moviepy.editor import VideoFileClip
import os
from models import db, Video
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
import uuid

app = Flask(__name__)
CORS(app)

matplotlib.use('Agg')

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


def covert_video_to_wav(filepath):
    video_clip = VideoFileClip(filepath)
    audio = video_clip.audio
    file_path, _ = os.path.splitext(filepath)
    audio_file_name = file_path + ".wav"
    audio.write_audiofile(audio_file_name, verbose=False, logger=None)
    return audio_file_name


# PITCH
def mean_pitch(snd, low_range, high_range):
    pitch = snd.to_pitch(time_step=0.1, pitch_ceiling=high_range)
    pitch_values = pitch.selected_array['frequency']
    selected_pitches = [p for p in pitch_values if low_range <= p]
    mean_pitch = np.mean(selected_pitches)
    return mean_pitch


def pitch(snd, low_range, high_range):
    pitch = snd.to_pitch(time_step=0.5, pitch_ceiling=high_range)

    pitch_values = pitch.selected_array['frequency']
    times = pitch.xs()
    window_size = 4.0

    window_starts = np.arange(0, times[-1], window_size)
    average_pitches = []

    for start in window_starts:
        end = start + window_size
        mask = (times >= start) & (times < end) & (pitch_values >= low_range)
        pitches_in_window = pitch_values[mask]
        average_pitch = np.mean(pitches_in_window) if pitches_in_window.size > 0 else 0
        average_pitches.append(average_pitch)

    return average_pitches, window_starts, window_size


def draw_pitch(average_pitches, window_starts, window_size, average_r, average_user, ten_percent, ninty_percent):
    plt.figure(figsize=(13, 4))
    filtered_pitches = [pitch if pitch >= 120 else None for pitch in average_pitches]
    plt.plot(window_starts, filtered_pitches)
    # average pitch
    plt.xlabel("Time (mins)")
    plt.ylabel("Pitch (Hz)")
    show_time = np.arange(0, max(window_starts) + window_size, 60)
    # average pitch
    plt.axhline(average_r, linestyle="-.", color='orange')

    # recommend average
    plt.axhline(average_user, linestyle="-.", color='green')
    # recommend range
    plt.fill_between(window_starts, ten_percent, ninty_percent, alpha=0.2)
    plt.xticks(ticks=show_time, rotation=30,
               labels=[f"{int(t / 60)} min" if t % 60 == 0 else f"{t}s" for t in show_time])

    ax = plt.gca()
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    buf = BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()

    return img_base64


def pitch_score(average_pitches, ten_percent, ninty_percent, user_mean, r_mean):
    points_in_range = 0
    for pitch in average_pitches:
        if ten_percent <= pitch <= ninty_percent:
            points_in_range += 1

    total_points = len(average_pitches)
    percentage = (points_in_range / total_points)

    diff = abs(user_mean - r_mean)
    score = np.exp(-diff / 50)

    per = (0.6 * percentage + score * 0.4) * 100

    return per


# INTENSITY
def mean_intensity(snd, low_range, pitch_min_range):
    intensity = snd.to_intensity(time_step=0.1, minimum_pitch=pitch_min_range)
    intensity_values = intensity.values.T
    selected_intensity = [i for i in intensity_values if low_range <= i]
    mean_intensity = np.mean(selected_intensity)
    return mean_intensity


def intensity(snd, low_range, pitch_min_range):
    intensity = snd.to_intensity(time_step=0.5, minimum_pitch=pitch_min_range, subtract_mean=True)
    intensity_values = np.array(intensity.values).flatten()
    times = np.array(intensity.xs())

    window_size = 4.0
    window_starts = np.arange(0, times[-1], window_size)
    average_intensities = []

    for start in window_starts:
        end = start + window_size
        mask = (times >= start) & (times < end) & (intensity_values >= low_range)
        intensities_in_window = intensity_values[mask]
        average_intensity = np.mean(intensities_in_window) if len(intensities_in_window) > 0 else 0
        average_intensities.append(average_intensity)

    return average_intensities, window_starts, window_size


def draw_intensity(average_intensities, window_starts, window_size, average_r, average_user, ten_percent,
                   ninty_percent):
    plt.figure(figsize=(13, 4))
    filtered_intensity = [intensity if intensity >= 30 else None for intensity in average_intensities]
    plt.plot(window_starts, filtered_intensity)
    plt.xlabel("Time (mins)")
    plt.ylabel("Intensity (dB)")
    show_time = np.arange(0, max(window_starts) + window_size, 60)

    plt.axhline(average_r, linestyle="-.", color='orange')
    plt.axhline(average_user, linestyle="-.", color='green')

    plt.fill_between(window_starts, ten_percent, ninty_percent, alpha=0.2)
    plt.xticks(ticks=show_time, rotation=30,
               labels=[f"{int(t / 60)} min" if t % 60 == 0 else f"{t}s" for t in show_time])

    ax = plt.gca()
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    buf = BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()
    return img_base64


def intensity_score(average_intensities, ten_percent, ninty_percent, user_mean, r_mean):
    points_in_range = 0
    for intensity in average_intensities:
        if ten_percent <= intensity <= ninty_percent:
            points_in_range += 1
    total_points = len(average_intensities)
    percentage = (points_in_range / total_points)

    diff = abs(user_mean - r_mean)
    score = np.exp(-diff / 50)

    per = (0.6 * percentage + score * 0.4) * 100
    return per


def score(pitch_score, intensity_score):
    return 0.5 * pitch_score + 0.5 * intensity_score


def draw_score(score):
    fig, ax = plt.subplots()
    arc = Arc([0.5, 0.5], 0.5, 0.5, angle=0, theta1=0, theta2=180, linewidth=20, color="orange")
    ax.add_patch(arc)
    arc = Arc([0.5, 0.5], 0.5, 0.5, angle=0, theta1=0, theta2=180 * (1 - score / 100), linewidth=20, color="gray")
    ax.add_patch(arc)

    plt.text(0.5, 0.55, f'{score:.1f}', ha='center', va='center', fontsize=20, color='orange')
    plt.text(0.5, 0.45, 'Score', ha='center', va='center', fontsize=15)

    ax.set_aspect('equal')
    ax.axis('off')

    plt.show()

    buf = BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()
    return img_base64


@app.route('/voice')
def draw():
    pitch_low_range = 0
    pitch_high_range = 0
    pitch_average = 0
    intensity_average = 0
    r_low_pitch = 0
    r_high_pitch = 0
    r_low_intensity = 0
    r_high_intensity = 0
    video_id = request.args.get('uuid')
    if video_id:
        video = Video.query.filter_by(id=video_id).first()
        if video:
            title = video.title
            filepath = os.path.join("static", title)
            wav_path = covert_video_to_wav(filepath)
            snd = parselmouth.Sound(wav_path)
            age = video.age
            gender = video.gender
            age_gender_mapping = {
                ("u35", "female"): {
                    "pitch_low_range": 150,
                    "pitch_high_range": 300,
                    "pitch_average": 214.2,
                    "intensity_average": 64.3,
                    "r_low_pitch": 166.3,
                    "r_high_pitch": 263.8,
                    "r_low_intensity": 40.1,
                    "r_high_intensity": 76.6
                },
                ("35to60", "female"): {
                    "pitch_low_range": 120,
                    "pitch_high_range": 300,
                    "pitch_average": 210.3,
                    "intensity_average": 60.7,
                    "r_low_pitch": 156.2,
                    "r_high_pitch": 261.4,
                    "r_low_intensity": 41.2,
                    "r_high_intensity": 76.7
                },
                ("u60", "female"): {
                    "pitch_low_range": 120,
                    "pitch_high_range": 250,
                    "pitch_average": 190.4,
                    "intensity_average": 65.5,
                    "r_low_pitch": 137,
                    "r_high_pitch": 225.9,
                    "r_low_intensity": 41.4,
                    "r_high_intensity": 76.7
                },
                ("u35", "male"): {
                    "pitch_low_range": 60,
                    "pitch_high_range": 260,
                    "pitch_average": 144.5,
                    "intensity_average": 59.9,
                    "r_low_pitch": 104.3,
                    "r_high_pitch": 197.4,
                    "r_low_intensity": 40.4,
                    "r_high_intensity": 76.8
                },
                ("35to60", "male"): {
                    "pitch_low_range": 80,
                    "pitch_high_range": 250,
                    "pitch_average": 134.3,
                    "intensity_average": 63.5,
                    "r_low_pitch": 98.7,
                    "r_high_pitch": 196.2,
                    "r_low_intensity": 41.8,
                    "r_high_intensity": 77
                },
                ("u60", "male"): {
                    "pitch_low_range": 70,
                    "pitch_high_range": 280,
                    "pitch_average": 149.6,
                    "intensity_average": 66.6,
                    "r_low_pitch": 101.1,
                    "r_high_pitch": 201.3,
                    "r_low_intensity": 43.1,
                    "r_high_intensity": 77.1
                },
                ("pnsa", "male"): {
                    "pitch_low_range": 60,
                    "pitch_high_range": 280,
                    "pitch_average": 142.8,
                    "intensity_average": 63.4,
                    "r_low_pitch": 101.4,
                    "r_high_pitch": 198.3,
                    "r_low_intensity": 41.8,
                    "r_high_intensity": 77
                },
                ("pnsa", "female"): {
                    "pitch_low_range": 120,
                    "pitch_high_range": 300,
                    "pitch_average": 205,
                    "intensity_average": 63.5,
                    "r_low_pitch": 153.2,
                    "r_high_pitch": 250.4,
                    "r_low_intensity": 40.9,
                    "r_high_intensity": 76.7
                },
                ("u35", "pns"): {
                    "pitch_low_range": 60,
                    "pitch_high_range": 300,
                    "pitch_average": 179.4,
                    "intensity_average": 62.1,
                    "r_low_pitch": 135.3,
                    "r_high_pitch": 230.6,
                    "r_low_intensity": 40.3,
                    "r_high_intensity": 76.7
                },
                ("35to60", "pns"): {
                    "pitch_low_range": 80,
                    "pitch_high_range": 300,
                    "pitch_average": 172.3,
                    "intensity_average": 62.1,
                    "r_low_pitch": 127.5,
                    "r_high_pitch": 228.8,
                    "r_low_intensity": 41.5,
                    "r_high_intensity": 76.9
                },
                ("u60", "pns"): {
                    "pitch_low_range": 70,
                    "pitch_high_range": 280,
                    "pitch_average": 170,
                    "intensity_average": 66.1,
                    "r_low_pitch": 119.1,
                    "r_high_pitch": 213.6,
                    "r_low_intensity": 42.3,
                    "r_high_intensity": 76.9
                },
                ("pnsa", "pns"): {
                    "pitch_low_range": 60,
                    "pitch_high_range": 300,
                    "pitch_average": 173.9,
                    "intensity_average": 63.5,
                    "r_low_pitch": 127.3,
                    "r_high_pitch": 224.4,
                    "r_low_intensity": 41.4,
                    "r_high_intensity": 76.9
                },
            }

            if (age, gender) in age_gender_mapping:
                params = age_gender_mapping[(age, gender)]
                pitch_low_range = params["pitch_low_range"]
                pitch_high_range = params["pitch_high_range"]
                pitch_average = params["pitch_average"]
                intensity_average = params["intensity_average"]
                r_low_pitch = params["r_low_pitch"]
                r_high_pitch = params["r_high_pitch"]
                r_low_intensity = params["r_low_intensity"]
                r_high_intensity = params["r_high_intensity"]
            average_pitch = mean_pitch(snd, pitch_low_range, pitch_high_range)
            average_pitches, window_starts, window_size = pitch(snd, pitch_low_range, pitch_high_range)

            average_intensity = mean_intensity(snd, 30, 120)
            average_intensities, window_starts_intensity, window_size_intensity = intensity(snd, 30, 120)
            base64_pitch = draw_pitch(average_pitches, window_starts, window_size, pitch_average, average_pitch,
                                      r_low_pitch, r_high_pitch)
            base64_intensity = draw_intensity(average_intensities, window_starts_intensity, window_size_intensity,
                                              intensity_average,
                                              average_intensity,
                                              r_low_intensity, r_high_intensity)
            pitchScore = pitch_score(average_pitches, r_low_pitch, r_high_pitch, average_pitch, pitch_average)
            intensitySocre = intensity_score(average_intensities, r_low_intensity, r_high_intensity, average_intensity,
                                             intensity_average)
            score_f = score(pitchScore, intensitySocre)
            base64_score = draw_score(score_f)
            return jsonify({
                'pitch_image': base64_pitch,
                'intensity_image': base64_intensity,
                'score': base64_score,
                'title': title,
                'average_p': f"{average_pitch :.2f}",
                'average_i': f"{average_intensity: .2f}",
                'time_h': int(window_starts[-1] / 60),
                'time_m': (window_starts[-1] % 60)
            })
        else:
            return jsonify({"error": "Video Not Found"})
    else:
        return jsonify({"error": "Video ID Not Found"})


# Store video to static
def delete_file_later(path, delay):
    # After fix time to delete the video
    time.sleep(delay)
    if os.path.exists(path):
        os.remove(path)
        print(f"Deleted file: {path}")


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

        new_video = Video(id=video_uuid, title=filename, gender=gender, age=age)
        db.session.add(new_video)

        delay = 7200

        thread = threading.Thread(target=delete_file_later, args=(save_path, delay))
        thread.start()
    db.session.commit()
    return jsonify(video_uuid=video_uuid)


if __name__ == '__main__':
    app.run(debug=True)
