import base64
from io import BytesIO

from nltk.corpus import cmudict
import nltk
import matplotlib.pyplot as plt
import numpy as np


def speed_for_one_segment(segments):
    segments_speed = []
    total_words = 0
    total_duration = 0

    for start, end, segment in segments:
        # 计算段落的单词数
        words = segment.split()  # 默认按空格分割
        word_count = len(words)
        duration = (end - start) / 1000 / 60  # 持续时间，假设start和end单位是秒
        total_words += word_count
        total_duration += duration
        # 计算每个段落的单词阅读速率（单词）
        segment_wpm = word_count / (duration)
        segments_speed.append((end / 1000, segment_wpm))

    # 计算整体平均速度（单词/分钟）
    average_speed = total_words / total_duration if total_duration else 0

    return segments_speed, average_speed


def format_time(seconds):
    """将秒转换为‘分钟:秒’的格式，若没有分钟则显示0"""
    minutes = seconds // 60
    seconds = seconds % 60
    return f"{int(minutes)} mins {int(seconds):02d} s"


def draw_speed(total_time, segments_speed, average_speed):
    segment_step = 0
    total_duration = total_time / 60
    if total_duration <= 5:
        segment_step = 1
    elif total_duration <= 10:
        segment_step = 2
    elif total_duration <= 20:
        segment_step = 4
    elif total_duration <= 30:
        segment_step = 6
    elif total_duration <= 60:
        segment_step = 8
    else:
        segment_step = 15
    averaged_speeds = []
    time_points = []
    for i in range(0, len(segments_speed), segment_step):
        segment_group = segments_speed[i:i + segment_step]
        if segment_group:
            avg_speed = np.mean([speed for _, speed in segment_group])
            averaged_speeds.append(avg_speed)
            # 使用分组中最后一个分段的开始时间作为时间点
            time_points.append(segment_group[-1][0])

    time_labels = [format_time(t) for t in time_points]

    # 绘图
    plt.figure(figsize=(13, 5))
    plt.plot(time_labels, averaged_speeds)
    plt.axhline(y=average_speed, color='green', linestyle='-.')
    plt.ylabel('Word Speed (Words/Minute)')

    plt.fill_between(time_labels, 130, 170, alpha=0.2)

    plt.grid(False)
    plt.xticks(rotation=20)

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







