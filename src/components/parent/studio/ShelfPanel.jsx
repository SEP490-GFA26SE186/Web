import { BookPlus, Check, Loader2, Lock } from "lucide-react";
import { useShelfStatus, useToggleShelf } from "../../../hooks/useStudio";
import { toast } from "../../../stores/toastStore";

const REASON = {
  not_reviewed: "Bấm hoàn tất truyện trước khi đưa lên giá sách.",
  narration_incomplete: "Đợi giọng đọc tạo xong (hoặc thử lại giọng đọc) rồi mới đưa lên giá sách được.",
};

// Đưa truyện lên giá sách của từng bé. Chỉ mở khi truyện "sẵn sàng cho trẻ" (story.readiness từ BE).
function ShelfPanel({ story }) {
  const ready = story.readiness?.ready;
  const { data, isLoading } = useShelfStatus(story.id, { enabled: !!story.reviewedAt });
  const toggle = useToggleShelf(story.id);
  if (!story.reviewedAt) return null;

  const onToggle = (child) =>
    toggle.mutate(
      { childId: child.childId, add: !child.inBookshelf },
      {
        onSuccess: () => toast.success(child.inBookshelf ? `Đã bỏ khỏi giá sách của ${child.name}` : `Đã đưa lên giá sách của ${child.name}`),
        onError: (err) => toast.error(err.message),
      },
    );

  return (
    <div className="card space-y-3 p-5">
      <h2 className="flex items-center gap-2 text-lg">
        <BookPlus size={22} className="text-primary" /> Giá sách của bé
      </h2>
      {!ready ? (
        <p className="flex items-start gap-2 text-sm text-navy/65">
          <Lock size={16} className="mt-0.5 shrink-0" /> {REASON[story.readiness?.reason] ?? "Truyện chưa sẵn sàng cho bé đọc."}
        </p>
      ) : isLoading ? (
        <Loader2 size={20} className="animate-spin text-primary" />
      ) : !data?.children?.length ? (
        <p className="text-sm text-navy/65">Ba mẹ chưa thêm hồ sơ bé nào.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {data.children.map((child) => {
            const busy = toggle.isPending && toggle.variables?.childId === child.childId;
            return (
              <button
                key={child.childId}
                type="button"
                onClick={() => onToggle(child)}
                disabled={busy}
                aria-pressed={child.inBookshelf}
                className={`inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-bold transition disabled:opacity-60 ${
                  child.inBookshelf ? "border-secondary bg-secondary-tint text-secondary-dark" : "border-outline bg-white hover:border-primary"
                }`}
              >
                {busy ? <Loader2 size={15} className="animate-spin" /> : child.inBookshelf ? <Check size={15} /> : <BookPlus size={15} />}
                {child.inBookshelf ? `Đã có trên giá của ${child.name}` : `Đưa lên giá của ${child.name}`}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ShelfPanel;
