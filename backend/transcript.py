from pydub import AudioSegment
from pydub.silence import split_on_silence
import speech_recognition as sr
import spacy
import tempfile


def split_audio_on_silence_with_timing(audio_file_path, min_silence_len=700, silence_thresh=-40):
    """
    使用静默暂停点分段音频文件，并记录分段时间（开始和结束）。

    参数:
    - audio_file_path: 音频文件路径。
    - min_silence_len: 认为是静默的最短时长（毫秒）。
    - silence_thresh: 静默的阈值（dB）。

    返回:
    - 分段的音频列表及其开始和结束时间（毫秒）。
    """
    audio = AudioSegment.from_file(audio_file_path)
    total_duration = len(audio) / 1000.0
    chunks = split_on_silence(
        audio,
        min_silence_len=min_silence_len,
        silence_thresh=silence_thresh,
        keep_silence=350,  # 在每段前后保留500毫秒静默
    )

    # 计算每个分段的开始和结束时间
    elapsed_time = 0
    segments_timing = []
    for chunk in chunks:
        start_ms = elapsed_time
        end_ms = start_ms + len(chunk)
        segments_timing.append((start_ms, end_ms, chunk))
        elapsed_time += len(chunk)

    return segments_timing, total_duration


def recognize_segments(segments_timing):
    recognizer = sr.Recognizer()
    results = []
    full_transcript = ""

    for start_ms, end_ms, segment in segments_timing:
        # 将每个音频段导出到一个临时文件中
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=True) as tmpfile:
            segment.export(tmpfile.name, format="wav")
            with sr.AudioFile(tmpfile.name) as source:
                audio_data = recognizer.record(source)
                try:
                    text = recognizer.recognize_google(audio_data)
                    results.append((start_ms, end_ms, text))
                    full_transcript += " " + text
                except sr.UnknownValueError:
                    results.append((start_ms, end_ms, "Can not recognize"))
                except sr.RequestError as e:
                    results.append((start_ms, end_ms, f"error: {e}"))

    return results, full_transcript.strip()

def text_to_sentence(text):
    nlp = spacy.load('en_core_web_sm')

    doc = nlp(text)
    sentences = [sent.text for sent in doc.sents]
    return sentences