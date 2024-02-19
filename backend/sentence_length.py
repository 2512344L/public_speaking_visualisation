import numpy as np

def sentence_length(segments):
    word_counts = []
    for start, end, segment in segments:
        # 计算段落的单词数
        words = segment.split()  # 默认按空格分割
        word_count = len(words)
        word_counts.append(word_count)
    mean = np.mean(word_counts)
    if mean > 75:
        mean = 75
    all_count = sum(word_counts)
    return mean, all_count