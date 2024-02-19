import matplotlib.pyplot as plt
import numpy as np
from io import BytesIO
import base64
from matplotlib.patches import Arc


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


    buf = BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()
    plt.close()
    return img_base64
