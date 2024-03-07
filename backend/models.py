from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String
from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=True)
    email = Column(String(255), unique=True, nullable=False)
    password = db.Column(db.String(128))

    videos = db.relationship('Video', backref='author', lazy='dynamic')

    def set_password(self, password):
        if password is None:
            raise ValueError("Password cannot be None")
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


class Video(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    title = Column(db.String(100), nullable=False)
    gender = db.Column(db.String(30))
    age = db.Column(db.String(30))
    times = Column(db.DateTime, default=func.now())

    average_p = db.Column(db.Float, nullable=True)
    average_i = db.Column(db.Float, nullable=True)
    time_h = db.Column(db.Integer, nullable=True)
    time_m = db.Column(db.Float, nullable=True)
    rec_pitch = db.Column(db.Float, nullable=True)
    rec_intensity = db.Column(db.Float, nullable=True)
    score = db.Column(db.Integer, nullable=True)

    transcript = db.Column(db.Text, nullable=True)
    simple = db.Column(db.Text, nullable=True)
    difficult = db.Column(db.Text, nullable=True)
    simple_p = db.Column(db.Float, nullable=True)
    diff_p = db.Column(db.Float, nullable=True)
    sentence_length = db.Column(db.Float, nullable=True)
    total_length = db.Column(db.Integer, nullable=True)
    average_speed = db.Column(db.Float, nullable=True)

    pitch_image = db.Column(db.Text, nullable=True)
    intensity_image = db.Column(db.Text, nullable=True)

    speed_plot = db.Column(db.Text, nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
