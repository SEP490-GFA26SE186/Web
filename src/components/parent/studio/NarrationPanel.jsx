import { AlertTriangle, CheckCircle2, Loader2, RotateCcw, Volume2 } from "lucide-react";
import { narrationState } from "./narrationState";

// Giọng đọc kể truyện (story.narration + story.readiness từ GET /stories/:id).
// Chỉ hiện sau khi ba mẹ bấm hoàn tất và truyện bật giọng đọc. Truyện chỉ lên giá sách cho bé
// khi đủ giọng đọc khớp chữ hiện tại.
function NarrationPanel({ story, onRetry, retrying }) {
  const state = narrationState(story);
  if (!state) return null;
  const { n, percent } = state;
  const working = state.phase === "working";
  const needsAction = state.phase === "failed" || state.phase === "stale";

  if (state.phase === "ready") {
    return (
      <div className="card flex items-center gap-3 border-secondary/40 p-5">
        <CheckCircle2 size={28} className="shrink-0 text-secondary-dark" />
        <div>
          <h2 className="text-lg">Giọng đọc đã sẵn sàng</h2>
          <p className="text-sm text-navy/65">Đã đọc xong {n.total} đoạn. Bé có thể nghe truyện này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card space-y-3 p-5 ${needsAction ? "border-danger/40" : ""}`} aria-live="polite">
      <div className="flex items-center gap-3">
        {working ? (
          <Loader2 size={26} className="shrink-0 animate-spin text-primary" />
        ) : needsAction ? (
          <AlertTriangle size={26} className="shrink-0 text-danger" />
        ) : (
          <Volume2 size={26} className="shrink-0 text-primary" />
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg">{working ? "Đang tạo giọng đọc…" : "Giọng đọc chưa đủ"}</h2>
          <p className="text-sm text-navy/65">
            {working
              ? `Đã xong ${n.ready}/${n.total} đoạn. Truyện 8 trang mất khoảng 5–6 phút; ba mẹ có thể rời trang này.`
              : n.missing > 0 && n.failed === 0
                ? `Có ${n.missing} đoạn đã sửa chữ sau lần hoàn tất trước. Bấm hoàn tất lại để đọc lại các đoạn đó.`
                : `Có ${n.failed + n.missing} đoạn chưa đọc được. Bé chưa nghe được truyện này cho tới khi đủ giọng đọc.`}
          </p>
        </div>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-navy-tint"
        role="progressbar"
        aria-label="Tiến độ giọng đọc"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
      </div>
      {n.failed > 0 && !working && (
        <button type="button" onClick={onRetry} disabled={retrying} className="btn-primary disabled:opacity-60">
          {retrying ? <Loader2 size={18} className="animate-spin" /> : <RotateCcw size={18} />} Thử lại giọng đọc
        </button>
      )}
    </div>
  );
}

export default NarrationPanel;
