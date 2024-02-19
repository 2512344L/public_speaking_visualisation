from itertools import islice, cycle

import nltk
from nltk.corpus import words, brown, stopwords
from nltk.tokenize import word_tokenize
from collections import Counter
import matplotlib.pyplot as plt
from io import BytesIO
import base64
import re

nltk.download('words')
nltk.download('brown')
nltk.download('punkt')  # 用于word_tokenize
nltk.download('stopwords')

# 使用Brown语料库计算词频
word_freq = nltk.FreqDist(w.lower() for w in brown.words())

# 将NLTK的词汇列表转换为小写，以便于比较
word_list = set(w.lower() for w in words.words())

stop_words = set(stopwords.words('english'))


# 定义一个函数来评估文本中每个单词的难度
def evaluate_text_difficulty(text, threshold=1, top_n=10):
    pattern = re.compile(r"^[a-zA-Z]+$")
    word_counts = Counter([word for word in word_tokenize(text.lower()) if pattern.match(word)])

    simple_words = {}
    difficult_words = {}

    for word, count in word_counts.items():
        if pattern.match(word) and word not in stop_words:
            freq = word_freq[word]
            if freq > threshold:
                simple_words[word] = count
            else:
                difficult_words[word] = count
        elif word not in stop_words:
            difficult_words[word] = count

    # 只获取单词部分
    common_simple = [word for word, count in sorted(simple_words.items(), key=lambda x: -x[1])[:top_n]]
    short_simple = [word for word in sorted([word for word in simple_words.keys() if word not in common_simple],
                                            key=lambda x: (len(x), simple_words[x]))[:top_n]]

    common_difficult = [word for word, count in sorted(difficult_words.items(), key=lambda x: -x[1])[:top_n]]
    long_difficult = [word for word in sorted([word for word in difficult_words.keys() if word not in common_difficult],
                                              key=lambda x: (-len(x), difficult_words[x]))[:top_n]]

    simple_list = list(islice(cycle(common_simple + short_simple), top_n * 2))
    diff_list = list(islice(cycle(common_difficult + long_difficult), top_n * 2))

    return list(simple_words.keys()), list(difficult_words.keys()), len(simple_words.keys()) / (len(simple_words.keys()) + len(
        difficult_words.keys())), len(difficult_words.keys()) / (len(simple_words.keys()) + len(
        difficult_words.keys())), simple_list, diff_list


def pie_plot(simple_p, diff_p):
    size = [simple_p * 100, diff_p * 100]
    colors = ['grey', 'orange']
    plt.pie(size, colors=colors, autopct='%1.1f%%', shadow=False, startangle=140, counterclock=False, textprops={'fontsize': 16})
    plt.axis('equal')

    plt.gca().spines['top'].set_visible(False)
    plt.gca().spines['right'].set_visible(False)
    plt.gca().spines['bottom'].set_visible(False)
    plt.gca().spines['left'].set_visible(False)

    buf = BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    buf.close()

    plt.close()

    return img_base64
