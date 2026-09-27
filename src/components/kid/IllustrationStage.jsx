import { useEffect, useRef, useState } from "react";
import { Hand } from "lucide-react";
import { speak } from "../../utils/speech";

const HOTSPOT_TONES = { primary: "bg-primary", secondary: "bg-secondary" };

// Tranh minh họa + các điểm chạm tương tác. Khi có ảnh thật từ BE, truyền `image` để thay cảnh emoji.
function IllustrationStage({ page, title, image, muted, rate }) {
  const [bubble, setBubble] = useState(null);
  const touchCount = useRef(0);

  useEffect(() => {
    if (!bubble) return;
    const t = setTimeout(() => setBubble(null), 3200);
    return () => clearTimeout(t);
  }, [bubble]);

  const touch = (h) => {
    touchCount.current += 1;
    setBubble({ id: `${h.id}_${touchCount.current}`, emoji: h.emoji, message: h.message });
    if (!muted) speak(h.message.replace(/[^\p{L}\p{N}\s.,!?“”"]/gu, ""), rate);
  };

  const [main, ...others] = page.scene;

  return (
    <div className="group relative h-[400px] w-full overflow-hidden rounded-stage bg-surface shadow-mid sm:h-[480px] lg:h-full lg:min-h-[480px]">
      {image ? (
        <img src={image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
      ) : (
        <div className={`relative grid h-full w-full place-items-center bg-gradient-to-br ${page.gradient} transition-transform duration-700 group-hover:scale-[1.02]`}>
          <span className="text-[160px] drop-shadow-xl select-none sm:text-[200px]" aria-hidden="true">
            {main}
          </span>
          {others.map((e, i) => (
            <span
              key={e + i}
              aria-hidden="true"
              className="absolute text-6xl drop-shadow-lg select-none sm:text-7xl"
              style={{ left: i % 2 ? "12%" : "72%", top: i % 2 ? "22%" : "58%" }}
            >
              {e}
            </span>
          ))}
          <span className="absolute top-16 left-[30%] text-2xl text-white/80">✦</span>
          <span className="absolute right-[18%] bottom-[30%] text-lg text-white/70">✦</span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/5" />

      <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-canvas/90 px-4 py-2 shadow-low backdrop-blur-md">
        <span className="h-3 w-3 animate-ping rounded-full bg-secondary" />
        <span className="font-display text-[15px] font-bold">{title}</span>
      </div>

      {page.hotspots.map((h) => (
        <button
          key={h.id}
          onClick={() => touch(h)}
          style={{ left: `${h.x}%`, top: `${h.y}%` }}
          className="group/btn absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 shadow-high backdrop-blur-md transition duration-300 hover:scale-110 active:scale-95"
        >
          <span className={`grid h-8 w-8 place-items-center rounded-full text-base text-white shadow-low ${HOTSPOT_TONES[h.tone]} ${h.bounce ? "animate-bounce" : ""}`}>
            {h.emoji}
          </span>
          <span className="pr-1 text-sm font-bold">{h.label}</span>
          <Hand size={18} className={h.tone === "secondary" ? "text-secondary" : "text-primary"} />
        </button>
      ))}

      {bubble && (
        <div
          key={bubble.id}
          role="status"
          className="absolute bottom-6 left-1/2 flex w-[min(90%,480px)] -translate-x-1/2 items-center gap-3 rounded-2xl bg-canvas/95 px-5 py-3 shadow-high backdrop-blur-lg"
        >
          <span className="text-2xl">{bubble.emoji}</span>
          <p className="font-display text-base leading-snug font-bold text-secondary-dark">{bubble.message}</p>
        </div>
      )}
    </div>
  );
}

export default IllustrationStage;
