import { useEffect } from "react";
import { Heart, Mic, Pause, Play, Quote, RotateCcw } from "lucide-react";
import useNarration from "../../hooks/useNarration";
import useKidStore from "../../stores/kidStore";

const SPEEDS = [
  { value: 0.8, label: "0.8x Chậm rãi" },
  { value: 0.9, label: "0.9x Dễ nghe" },
  { value: 1, label: "1.0x Bình thường" },
];
const WAVE = [4, 7, 9, 6, 10, 8, 5, 7, 3];

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// Thanh giọng đọc + chữ karaoke cho bé mới tập đọc. Được mount lại mỗi khi sang trang.
function ReadAlongPanel({ segments, tip, narrator }) {
  const { muted, rate, setRate, autoPlay, setAutoPlay } = useKidStore();
  const { words, wordIndex, playing, elapsed, duration, toggle, replay, startFrom } = useNarration(segments, { rate, muted });

  // Sau khi bé đã bấm nghe 1 lần, các trang tiếp theo tự đọc
  useEffect(() => {
    if (!autoPlay) return;
    const t = setTimeout(() => startFrom(0), 500);
    return () => clearTimeout(t);
    // chỉ chạy khi mount trang mới
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = () => {
    if (!playing) setAutoPlay(true);
    toggle();
  };

  const cycleSpeed = () => {
    const i = SPEEDS.findIndex((s) => s.value === rate);
    setRate(SPEEDS[(i + 1) % SPEEDS.length].value);
  };

  const segmentClass = { sfx: "inline-block text-[28px] tracking-wide text-secondary-dark", quote: "mt-2 block text-[22px] italic text-secondary-dark" };

  return (
    <div className="flex flex-col justify-between gap-5 rounded-stage bg-white p-5 shadow-low sm:p-7 lg:col-span-5">
      <div className="flex w-full flex-col gap-3 rounded-card bg-surface p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-tint text-primary">
              <Mic size={18} className="fill-primary" />
            </span>
            <div>
              <p className="text-xs font-bold text-navy/60">Giọng đọc kể chuyện</p>
              <p className="text-sm font-bold">{narrator}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={replay} title="Nghe lại" className="flex h-9 items-center gap-1 rounded-full bg-outline/70 px-2.5 text-navy/70 transition hover:bg-outline hover:text-navy">
              <RotateCcw size={17} /> <span className="hidden text-xs font-bold sm:inline">Nghe lại</span>
            </button>
            <button onClick={cycleSpeed} className="h-9 rounded-full bg-outline/70 px-3 text-xs font-bold text-primary-dark transition hover:bg-outline">
              {SPEEDS.find((s) => s.value === rate)?.label}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-1">
          <button
            onClick={handleToggle}
            aria-label={playing ? "Tạm dừng" : "Nghe kể chuyện"}
            className={`grid h-16 w-16 shrink-0 place-items-center rounded-full text-white shadow-mid transition duration-300 active:scale-95 ${
              playing ? "bg-secondary hover:bg-secondary-dark" : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {playing ? <Pause size={32} className="fill-white" /> : <Play size={34} className="ml-1 fill-white" />}
          </button>
          <div className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full bg-white px-3" aria-hidden="true">
            {WAVE.map((h, i) => (
              <span
                key={i}
                className={`w-1.5 rounded-full ${i % 2 ? "bg-primary" : "bg-secondary"} ${playing ? (i % 3 ? "animate-bounce" : "animate-pulse") : "opacity-40"}`}
                style={{ height: `${h * 4}px`, animationDelay: `${i * 70}ms` }}
              />
            ))}
          </div>
          <span className="font-mono text-xs text-navy/50">
            {fmt(elapsed)}
            <span className="hidden sm:inline"> / {fmt(duration)}</span>
          </span>
        </div>
        {muted && <p className="text-center text-xs font-semibold text-navy/50">🔇 Loa đang tắt — chữ vẫn sáng lên theo nhịp đọc</p>}
      </div>

      <div className="flex flex-1 flex-col justify-center px-1 py-2">
        <div className="relative rounded-card bg-surface p-5">
          <Quote size={30} className="absolute -top-3 -left-1 text-primary/20" />
          <p className="font-display text-[22px] leading-loose font-bold sm:text-[24px]">
            {segments.map((seg, segIndex) => (
              <span key={segIndex} className={segmentClass[seg.style] ?? ""}>
                {words
                  .map((w, i) => ({ ...w, i }))
                  .filter((w) => w.segIndex === segIndex)
                  .map((w) => (
                    <span key={w.i}>
                      <span
                        className={`rounded-lg transition-colors duration-150 ${
                          w.i === wordIndex ? "bg-primary-tint px-1 text-primary-dark" : w.i < wordIndex ? "text-primary-dark" : ""
                        }`}
                      >
                        {w.text}
                      </span>{" "}
                    </span>
                  ))}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-2xl bg-secondary-tint p-3 text-sm text-secondary-dark">
        <Heart size={22} className="shrink-0 fill-secondary text-secondary" />
        <p>
          <strong>Mẹo nhỏ cùng Roco:</strong> {tip}
        </p>
      </div>
    </div>
  );
}

export default ReadAlongPanel;
