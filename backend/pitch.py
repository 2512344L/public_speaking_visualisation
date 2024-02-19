import matplotlib.pyplot as plt
import numpy as np
from io import BytesIO
import base64


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
    # average pitch
    plt.axhline(average_r, linestyle="-.", color='orange')

    # recommend average
    plt.axhline(average_user, linestyle="-.", color='green')
    # recommend range
    plt.fill_between(window_starts, ten_percent, ninty_percent, alpha=0.2)

    estimated_video_length = window_starts[-1] + window_size  # 以秒为单位

    if estimated_video_length <= 60:  # 小于1分钟
        tick_step = 5
        label_format = "{} s"
    elif estimated_video_length <= 180:  # 1到3分钟
        tick_step = 15
        label_format = "{} s"
    elif estimated_video_length <= 360:  # 3到6分钟
        tick_step = 20
        label_format = "{} s"
    elif estimated_video_length <= 480:  # 6到8分钟
        tick_step = 30
        label_format = "{} s"
    else:  # 大于8分钟
        tick_step = 60
        label_format = "{} min"

    show_time = np.arange(0, estimated_video_length + tick_step, tick_step)

    # 生成时间标签，对于第一个标签特殊处理
    labels = [label_format.format(int(t / 60) if label_format.endswith("m") else t) for t in show_time]
    plt.xticks(ticks=show_time, rotation=30,labels=labels)

    ax = plt.gca()
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)


    buf = BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()
    plt.close()

    return img_base64
