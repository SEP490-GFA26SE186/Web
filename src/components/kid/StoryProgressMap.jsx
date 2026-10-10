import { BookOpen, Check, LockOpen, Smile, Sparkles } from "lucide-react";
import { childEmoji } from "../../utils/child";

// Bản đồ tiến độ dạng "viên đá" cho bé: trang đã đọc, trang hiện tại, trang sắp tới, đích
function StoryProgressMap({ child, total, current, maxReached, onJump, caselFocus }) {
  const percent = ((current - 1) / (total - 1)) * 100;

  return (
    <div className="relative flex flex-col items-center justify-between gap-4 overflow-hidden rounded-stage bg-white p-4 shadow-low sm:p-5 md:flex-row">
      <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative flex w-full items-center gap-3 md:w-auto">
        <div className="relative">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-tint text-2xl shadow-low">{child ? childEmoji(child) : <Smile />}</span>
          <span className="absolute -right-1 -bottom-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-primary" />
          </span>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg">
              {child?.name ?? "Bé"}
              {child?.age != null && ` (${child.age} tuổi)`}
            </h2>
            <span className="rounded-full bg-secondary-tint px-2.5 py-0.5 text-xs font-bold text-secondary-dark">Độc giả nhí</span>
          </div>
          <p className="flex items-center gap-1 text-sm font-bold text-primary-dark">
            <BookOpen size={16} className="text-primary" /> Trang {current}/{total} — đọc tiếp để khám phá nhé!
          </p>
        </div>
      </div>

      <nav className="relative w-full max-w-xl flex-1 px-2 md:w-auto" aria-label="Tiến độ câu chuyện">
        <div className="relative flex items-center justify-between">
          <div className="absolute top-4 right-4 left-4 z-0 h-2 -translate-y-1/2 rounded-full bg-outline">
            <div className="h-full rounded-full bg-gradient-to-r from-secondary to-primary transition-all duration-700" style={{ width: `${percent}%` }} />
          </div>
          {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
            const isCurrent = n === current;
            const done = n < current || (n <= maxReached && n !== current);
            const isFinish = n === total;
            const canJump = !isCurrent && n <= maxReached;
            return (
              <button
                key={n}
                onClick={() => canJump && onJump(n)}
                disabled={!canJump}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={isFinish ? "Đích" : `Trang ${n}`}
                className={`relative z-10 flex flex-col items-center ${canJump ? "cursor-pointer" : "cursor-default"} ${!done && !isCurrent ? "opacity-60" : ""}`}
              >
                {isCurrent ? (
                  <span className="relative">
                    <span className="-my-1 grid h-10 w-10 animate-pulse place-items-center rounded-full bg-primary font-display font-bold text-white shadow-high ring-4 ring-primary-tint">
                      {n}
                    </span>
                  </span>
                ) : (
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold shadow-low transition hover:scale-110 ${
                      done ? "bg-secondary text-white" : "bg-outline text-navy/60"
                    }`}
                  >
                    {done ? <Check size={16} /> : isFinish ? <LockOpen size={16} /> : n}
                  </span>
                )}
                <span className={`mt-1 hidden text-xs sm:block ${isCurrent ? "mt-2 font-bold text-primary-dark" : "text-navy/60"}`}>
                  {isCurrent ? "Bé ở đây ✨" : isFinish ? "Đích" : n === 1 ? "Trang 1" : n}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <span className="relative hidden items-center gap-2 rounded-full bg-secondary-tint px-3.5 py-1.5 text-sm font-semibold text-secondary-dark lg:flex">
        <Sparkles size={18} /> {caselFocus}
      </span>
    </div>
  );
}

export default StoryProgressMap;
