// Tiện ích giọng đọc tiếng Việt bằng Web Speech API của trình duyệt.
// Khi BE có file audio TTS thật (ElevenLabs...), thay phần này bằng <audio> + timestamps từng từ.

export const speechSupported = () => typeof window !== "undefined" && "speechSynthesis" in window;

const pickVietnameseVoice = () =>
  window.speechSynthesis.getVoices().find((v) => v.lang?.toLowerCase().startsWith("vi")) ?? null;

export const createUtterance = (text, rate = 0.9) => {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "vi-VN";
  utter.rate = rate;
  utter.pitch = 1.1;
  const voice = pickVietnameseVoice();
  if (voice) utter.voice = voice;
  return utter;
};

export const speak = (text, rate, onEnd) => {
  if (!speechSupported()) return;
  window.speechSynthesis.cancel();
  const utter = createUtterance(text, rate);
  if (onEnd) utter.onend = utter.onerror = onEnd;
  window.speechSynthesis.speak(utter);
};

export const stopSpeaking = () => speechSupported() && window.speechSynthesis.cancel();

// Tách các đoạn văn thành danh sách từ (giữ vị trí ký tự để khớp sự kiện boundary)
export const buildWords = (segments) => {
  const words = [];
  let text = "";
  segments.forEach((seg, segIndex) => {
    if (text) text += " ";
    for (const m of seg.text.matchAll(/\S+/g)) {
      words.push({ text: m[0], segIndex, start: text.length + m.index });
    }
    text += seg.text;
  });
  return { text, words };
};
