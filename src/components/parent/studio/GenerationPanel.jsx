import { AlertTriangle, Loader2, RotateCcw, Sparkles } from "lucide-react";

// Trạng thái AI viết truyện (GET /stories/:id/generation). Lỗi do BE trả về đã là câu tiếng Việt.
// `busy`: job còn chạy HOẶC truyện vẫn đang ở trạng thái generating (job vừa xong nhưng truyện chưa tải lại
// xong) — vẫn hiện khung "đang viết" để trang không trống trong lúc chờ.
function GenerationPanel({ generation, busy, neverGenerated, onStart, starting, startError }) {
  if (busy) {
    return (
      <div className="card flex flex-col items-center gap-3 p-8 text-center">
        <Loader2 size={40} className="animate-spin text-primary" />
        <h2 className="text-xl">Cú Weaver đang viết truyện…</h2>
        <p className="max-w-md text-sm text-navy/65">
          Thường mất từ 30 giây đến khoảng 3 phút với truyện dài. Ba mẹ cứ để trang này mở hoặc quay lại sau,
          truyện vẫn được viết tiếp.
        </p>
      </div>
    );
  }

  const failed = generation && (generation.status === "failed" || generation.status === "blocked");
  if (!failed && !neverGenerated) return null;

  return (
    <div className={`card flex flex-col items-center gap-3 p-8 text-center ${failed ? "border-danger/40" : ""}`}>
      {failed ? <AlertTriangle size={36} className="text-danger" /> : <Sparkles size={36} className="text-primary" />}
      <h2 className="text-xl">{failed ? "AI chưa viết được truyện" : "Truyện đang chờ AI viết"}</h2>
      {failed && (
        <p className="max-w-md text-sm text-navy/70">
          {generation.errorMessage || "Có lỗi xảy ra."} Credit của lần này đã được hoàn lại.
        </p>
      )}
      {startError && <p className="max-w-md text-sm font-semibold text-danger">{startError}</p>}
      <button type="button" onClick={onStart} disabled={starting} className="btn-primary disabled:opacity-70">
        {starting ? <Loader2 size={18} className="animate-spin" /> : failed ? <RotateCcw size={18} /> : <Sparkles size={18} />}
        {failed ? "Cho AI viết lại" : "Cho AI viết truyện"}
      </button>
    </div>
  );
}

export default GenerationPanel;
