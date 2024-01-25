from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

db = SQLAlchemy()

class Video(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    title = Column(db.String(100), nullable=False)
    gender = db.Column(db.String(30))
    age = db.Column(db.String(30))
    times = Column(db.DateTime, default=func.now())
