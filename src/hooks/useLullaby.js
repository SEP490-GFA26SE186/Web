import { useEffect } from "react";

// Nhạc ru ngủ tổng hợp bằng Web Audio: các nốt ngũ cung trầm, âm lượng nhỏ, nhịp chậm.
// Không cần file nhạc — khi có nhạc thật từ BE có thể thay bằng thẻ <audio loop>.
const NOTES = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25]; // C D E G A C

export default function useLullaby(enabled) {
  useEffect(() => {
    if (!enabled) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = 0.06;
    master.connect(ctx.destination);

    let step = 0;
    const playNote = () => {
      const freq = NOTES[[0, 2, 4, 3, 1, 2, 5, 4][step % 8]];
      step += 1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(1, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
      osc.connect(gain).connect(master);
      osc.start(now);
      osc.stop(now + 1.7);
    };

    playNote();
    const timer = setInterval(playNote, 900);
    return () => {
      clearInterval(timer);
      ctx.close();
    };
  }, [enabled]);
}
