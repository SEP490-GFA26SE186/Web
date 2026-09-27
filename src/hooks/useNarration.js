import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildWords, createUtterance, speechSupported } from "../utils/speech";

const WORDS_PER_MINUTE = 130;

/**
 * Đọc truyện kiểu karaoke: trả về chỉ số từ đang được đọc để tô sáng.
 * - Có giọng đọc: đồng bộ theo sự kiện boundary của trình duyệt.
 * - Không có boundary / đang tắt tiếng: ước lượng theo thời gian.
 */
export default function useNarration(segments, { rate = 0.9, muted = false } = {}) {
  const { text, words } = useMemo(() => buildWords(segments), [segments]);
  const secondsPerWord = 60 / (WORDS_PER_MINUTE * rate);
  const duration = words.length * secondsPerWord;
  const voiced = !muted && speechSupported();

  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [boundaryIndex, setBoundaryIndex] = useState(null);

  const timerRef = useRef(null);
  const tokenRef = useRef(0); // bỏ qua sự kiện của lần đọc cũ

  const stopAll = useCallback(() => {
    tokenRef.current += 1;
    clearInterval(timerRef.current);
    if (speechSupported()) window.speechSynthesis.cancel();
  }, []);

  const finish = useCallback(() => {
    stopAll();
    setPlaying(false);
    setFinished(true);
  }, [stopAll]);

  const startFrom = useCallback(
    (fromWord = 0) => {
      stopAll();
      const token = tokenRef.current;
      const startWord = Math.min(Math.max(fromWord, 0), words.length - 1);
      const offset = words[startWord]?.start ?? 0;
      setPlaying(true);
      setFinished(false);
      setBoundaryIndex(null);
      setElapsed(startWord * secondsPerWord);

      if (voiced) {
        // Thay emoji bằng khoảng trắng cùng độ dài: giọng đọc bỏ qua nhưng vị trí ký tự vẫn khớp
        const spoken = text.slice(offset).replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, (m) => " ".repeat(m.length));
        const utter = createUtterance(spoken, rate);
        utter.onboundary = (e) => {
          if (token !== tokenRef.current) return;
          const pos = offset + e.charIndex;
          const next = words.findIndex((w) => w.start > pos);
          setBoundaryIndex(Math.max((next === -1 ? words.length : next) - 1, startWord));
        };
        utter.onend = () => token === tokenRef.current && finish();
        window.speechSynthesis.speak(utter);
      }
      timerRef.current = setInterval(() => setElapsed((e) => e + 0.1), 100);
    },
    [stopAll, words, text, rate, voiced, secondsPerWord, finish],
  );

  // Không có giọng đọc thật → tự kết thúc theo thời lượng ước tính
  useEffect(() => {
    if (!playing || voiced || elapsed < duration) return;
    const t = setTimeout(finish, 0);
    return () => clearTimeout(t);
  }, [playing, voiced, elapsed, duration, finish]);

  useEffect(() => stopAll, [stopAll]);

  let wordIndex = -1;
  if (finished) wordIndex = words.length;
  else if (boundaryIndex != null) wordIndex = boundaryIndex;
  else if (playing || elapsed > 0) wordIndex = Math.min(Math.floor(elapsed / secondsPerWord), words.length - 1);

  const pause = () => {
    stopAll();
    setPlaying(false);
  };
  const toggle = () => (playing ? pause() : startFrom(finished || wordIndex < 0 ? 0 : wordIndex));
  const replay = () => startFrom(0);

  return { words, wordIndex, playing, elapsed: finished ? duration : Math.min(elapsed, duration), duration, toggle, replay, pause, startFrom };
}
