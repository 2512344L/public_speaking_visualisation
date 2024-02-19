import matplotlib.pyplot as plt
import numpy as np
from io import BytesIO
import base64

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

    plt.axhline(average_r, linestyle="-.", color='orange')
    plt.axhline(average_user, linestyle="-.", color='green')

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
    plt.xticks(ticks=show_time, rotation=30,
               labels=labels)

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