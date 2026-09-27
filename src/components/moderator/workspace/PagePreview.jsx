import { useEffect, useRef, useState } from "react";
import { Bot, Check, CheckCircle2, Expand, Pause, Play, Route, ShieldCheck, Volume2, ZoomIn, ZoomOut } from "lucide-react";

const WAVE = [3, 5, 2, 4, 6, 3, 5, 2, 4, 6, 5, 3, 4, 2, 5, 3, 4, 2, 3, 1, 4, 6, 3, 5];
const tagTones = {
  primary: "bg-primary-tint text-primary-dark",
  secondary: "bg-secondary-tint text-secondary-dark",
  neutral: "bg-outline text-navy/70",
};

// Trình phát giọng đọc (mô phỏng tiến trình — file audio thật sẽ lấy từ BE)
function AudioPlayer({ audio }) {
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const finished = elapsed >= audio.seconds;
  const playing = started && !finished;

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setElapsed((e) => Math.min(e + 0.25, audio.seconds)), 250);
    return () => clearInterval(t);
  }, [playing, audio.seconds]);

  const progress = elapsed / audio.seconds;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const toggle = () => {
    if (finished) {
      setElapsed(0);
      setStarted(true);
    } else {
      setStarted((p) => !p);
    }
  };

  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-surface px-4 py-2.5 shadow-low">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label={playing ? "Tạm dừng" : "Phát giọng đọc"}
            className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white shadow-low transition hover:scale-105"
          >
            {playing ? <Pause size={18} className="fill-white" /> : <Play size={18} className="fill-white" />}
          </button>
          <div className="leading-tight">
            <p className="text-sm font-bold">{audio.voice}</p>
            <p className="text-[11px] text-navy/60">
              {fmt(elapsed)} / {fmt(audio.seconds)} • Tốc độ {audio.speed}x chuẩn trẻ em
            </p>
          </div>
        </div>
        <span className="flex items-center gap-2">
          <Volume2 size={18} className="text-secondary" />
          <span className="rounded-full bg-secondary-tint px-2 py-0.5 text-[11px] font-bold text-secondary-dark">Âm thanh an toàn 100%</span>
        </span>
      </div>
      <div className="mt-1 flex h-6 items-center gap-1 px-1" aria-hidden="true">
        {WAVE.map((h, i) => (
          <span
            key={i}
            className={`w-1 rounded-full transition-colors ${i / WAVE.length < progress ? "bg-primary" : i / WAVE.length < progress + 0.1 && playing ? "bg-secondary" : "bg-outline"}`}
            style={{ height: `${h * 4}px` }}
          />
        ))}
      </div>
    </div>
  );
}

function PagePreview({ page, total, scanner }) {
  const [zoom, setZoom] = useState(100);
  const stageRef = useRef(null);
  const isMain = (c) => c.main;

  const fullscreen = () => stageRef.current?.requestFullscreen?.();

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-card bg-white px-4 py-2.5 shadow-low">
        <div className="flex flex-wrap items-center gap-2">
          <span className="h-3 w-3 animate-ping rounded-full bg-primary" />
          <span className="font-display font-bold">
            Chế độ xem trước trang {page.number} / {total}
          </span>
          {page.branchLabel && (
            <span className="rounded-full bg-secondary-tint px-2.5 py-0.5 text-xs font-bold text-secondary-dark">{page.branchLabel}</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-navy/60">
          <button onClick={() => setZoom((z) => Math.max(80, z - 10))} className="rounded-full p-1.5 hover:bg-surface" title="Thu nhỏ">
            <ZoomOut size={18} />
          </button>
          <span className="w-10 text-center text-xs font-bold">{zoom}%</span>
          <button onClick={() => setZoom((z) => Math.min(140, z + 10))} className="rounded-full p-1.5 hover:bg-surface" title="Phóng to">
            <ZoomIn size={18} />
          </button>
          <button onClick={fullscreen} className="ml-1 rounded-full p-1.5 hover:bg-surface" title="Toàn màn hình">
            <Expand size={18} />
          </button>
        </div>
      </div>

      <div ref={stageRef} className="flex flex-col overflow-hidden rounded-stage bg-white shadow-mid [&:fullscreen]:overflow-y-auto">
        <div className={`relative grid aspect-[16/10] w-full place-items-center bg-gradient-to-br ${page.gradient}`}>
          <span className="text-[120px] drop-shadow-lg select-none" role="img" aria-label={page.title}>
            {page.emoji}
          </span>
          <div className="absolute top-3 left-3 flex max-w-[85%] flex-wrap gap-1.5 text-xs">
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 font-semibold shadow-low backdrop-blur">
              <Bot size={14} className="text-primary" /> AI Gen: {page.imageModel}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-bold text-white shadow-low">
              <ShieldCheck size={14} /> Quét an toàn thị giác 100%
            </span>
            <span className="rounded-full bg-white/90 px-2 py-1 text-navy/60 shadow-low backdrop-blur">Không khuôn mặt người thật</span>
          </div>
          <span className="absolute right-3 bottom-3 rounded-full bg-white/95 px-3 py-1 font-display text-sm font-bold shadow-mid">
            Trang {page.number} / {total}
          </span>
        </div>

        <div className="flex flex-col gap-4 p-5 md:p-6">
          <div className="rounded-2xl bg-surface p-4 shadow-low">
            <p className="leading-relaxed" style={{ fontSize: `${(19 * zoom) / 100}px` }}>
              “{page.text} {page.highlight && <span className="font-bold text-primary-dark">{page.highlight}</span>}”
            </p>
          </div>

          {page.choices && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider text-navy/60 uppercase">Tương tác rẽ nhánh của bé:</span>
                <span className="text-xs font-bold text-secondary-dark">Điểm EQ thưởng +3</span>
              </div>
              {page.choices.map((c, i) => (
                <div
                  key={c.id}
                  className={`flex items-start justify-between gap-3 rounded-2xl p-4 transition ${
                    isMain(c) ? "bg-white shadow-low hover:bg-canvas" : "bg-surface/70 opacity-85 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                        isMain(c) ? "bg-secondary text-white" : "bg-outline text-navy/60"
                      }`}
                    >
                      {isMain(c) ? <Check size={16} /> : <Route size={16} />}
                    </span>
                    <div>
                      <p className="font-bold">
                        Lựa chọn {i + 1}: “{c.text}”
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {c.tags.map((t) => (
                          <span key={t.label} className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${tagTones[t.tone]}`}>
                            {t.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {isMain(c) ? (
                    <span className="shrink-0 rounded-full bg-secondary-tint px-2 py-1 text-xs font-bold text-secondary-dark">Nhánh hiện hành</span>
                  ) : (
                    <span className="shrink-0 text-xs text-navy/50">Nhánh phụ</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <AudioPlayer key={page.number} audio={page.audio} />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-navy/60">
            <span className="flex items-center gap-1 font-bold text-secondary-dark">
              <CheckCircle2 size={16} /> Không phát hiện từ khóa thô lỗ, đe dọa hay nội dung tiêu cực
            </span>
            <span className="text-navy/50">Bộ quét: {scanner}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PagePreview;
