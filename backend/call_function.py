import os
import parselmouth

from distinguish_word import evaluate_text_difficulty, pie_plot
from sentence_length import sentence_length
from speed_of_speech import speed_for_one_segment, draw_speed
from transcript import split_audio_on_silence_with_timing, text_to_sentence, recognize_segments
from intensity import mean_intensity, draw_intensity, intensity
from pitch import mean_pitch, draw_pitch, pitch
from voice_score import pitch_score, score, draw_score, intensity_score
from video_to_wav import covert_video_to_wav


def voice(video):
    pitch_low_range = 0
    pitch_high_range = 0
    pitch_average = 0
    intensity_average = 0
    r_low_pitch = 0
    r_high_pitch = 0
    r_low_intensity = 0
    r_high_intensity = 0

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
    return base64_pitch, base64_intensity, base64_score, title, average_pitch, average_intensity, window_starts, score_f, pitch_average, intensity_average


def text_function(video):
    title = video.title
    new_title = title.replace(".mp4", ".wav")
    filepath = os.path.join("static", new_title)
    segments_timing, total_time = split_audio_on_silence_with_timing(filepath)
    segments, transcript = recognize_segments(segments_timing)
    sentence = text_to_sentence(transcript)
    simple, difficult, simple_p, diff_p, simple_list, diff_list = evaluate_text_difficulty(transcript)
    word_plot = pie_plot(simple_p, diff_p)
    segments_speed, average_speed = speed_for_one_segment(segments)
    speed_picture = draw_speed(total_time, segments_speed, average_speed)
    length_average, length = sentence_length(segments)
    return title, sentence, simple, difficult, simple_list, diff_list, word_plot, speed_picture, length_average, length,average_speed, simple_p, diff_p
