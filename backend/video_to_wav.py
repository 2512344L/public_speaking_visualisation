import threading
import time
from moviepy.editor import VideoFileClip
import os


def delete_file_later(file_path, delay):
    time.sleep(delay)
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"File {file_path} has been deleted")
    else:
        print(f"File {file_path} was not found")


def covert_video_to_wav(filepath):
    video_clip = VideoFileClip(filepath)
    audio = video_clip.audio
    file_path, _ = os.path.splitext(filepath)
    audio_file_name = file_path + ".wav"
    audio.write_audiofile(audio_file_name, verbose=False, logger=None)

    delay = 7200
    thread = threading.Thread(target=delete_file_later, args=(audio_file_name, delay))
    thread.start()

    return audio_file_name
