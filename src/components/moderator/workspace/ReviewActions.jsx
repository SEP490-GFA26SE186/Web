import { useState } from "react";
import { BadgeCheck, CheckCheck, FilePenLine, Loader2, Lock, NotebookPen, Pencil, Send, XCircle } from "lucide-react";
import Modal from "../../common/Modal";

const DECISIONS = {
  publish: {
    title: "Phê duyệt & Xuất bản truyện",
    description: "Truyện sẽ được phát hành lên Chợ truyện và hiển thị cho cộng đồng phụ huynh.",
    placeholder: "Lời nhắn cho tác giả (không bắt buộc)",
    confirm: "Xác nhận xuất bản",
    required: false,
    className: "bg-secondary hover:bg-secondary-dark",
  },
  revise: {
    title: "Yêu cầu tác giả chỉnh sửa",
    description: "Tác giả nhận toàn bộ ghi chú theo từng trang và nộp lại bản mới.",
    placeholder: "Tổng hợp yêu cầu chỉnh sửa cho tác giả...",
    confirm: "Gửi yêu cầu sửa",
    required: true,
    className: "bg-primary hover:bg-primary-dark",
  },
  reject: {
    title: "Từ chối xuất bản",
    description: "Truyện bị loại khỏi hàng chờ. Tác giả có thể kháng nghị lên Admin trong 7 ngày.",
    placeholder: "Lý do từ chối (bắt buộc, tác giả sẽ nhận được nội dung này)",
    confirm: "Xác nhận từ chối",
    required: true,
    className: "bg-danger hover:bg-danger-dark",
  },
};

export function DecisionModal({ type, defaultNote, onClose, onConfirm, isPending }) {
  const [note, setNote] = useState(defaultNote ?? "");
  const config = DECISIONS[type];
  const invalid = config.required && !note.trim();

  return (
    <Modal
      open
      onClose={onClose}
      title={config.title}
      description={config.description}
      footer={
        <>
          <button onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Hủy
          </button>
          <button
            disabled={invalid || isPending}
            onClick={() => onConfirm(note.trim())}
            className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold text-white transition disabled:opacity-50 ${config.className}`}
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} {config.confirm}
          </button>
        </>
      }
    >
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={6}
        autoFocus
        placeholder={config.placeholder}
        className="w-full resize-none rounded-2xl border-[1.5px] border-outline p-3 text-sm outline-none focus:border-secondary focus:ring-[3px] focus:ring-secondary/15"
      />
    </Modal>
  );
}

function ReviewActions({ page, approvedCount, total, needsFixCount, saving, onRequestFix, onApprove, onDecision }) {
  const pageDone = page.status !== "pending";
  const canPublish = approvedCount === total;
  const remaining = total - approvedCount;

  let publishState = { text: "Chưa thể xuất bản", className: "text-primary-dark" };
  if (canPublish) publishState = { text: "Sẵn sàng xuất bản", className: "text-secondary-dark" };
  else if (needsFixCount) publishState = { text: `${needsFixCount} trang cần tác giả sửa`, className: "text-danger" };

  return (
    <div className="sticky bottom-4 z-10 flex flex-col gap-2 rounded-card bg-white p-4 shadow-high">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onRequestFix}
          disabled={pageDone || saving}
          className="flex items-center justify-center gap-1 rounded-full bg-outline/80 px-2 py-2.5 text-sm font-semibold transition hover:bg-outline disabled:opacity-50"
        >
          <Pencil size={17} className="text-primary" /> Yêu cầu sửa trang {page.number}
        </button>
        <button
          onClick={onApprove}
          disabled={pageDone || saving}
          className={`flex items-center justify-center gap-1 rounded-full px-2 py-2.5 text-sm font-bold shadow-low transition active:scale-95 ${
            page.status === "approved" ? "bg-secondary-tint text-secondary-dark" : "bg-secondary text-white hover:bg-secondary-dark disabled:opacity-50"
          }`}
        >
          {saving ? <Loader2 size={17} className="animate-spin" /> : page.status === "approved" ? <CheckCheck size={17} /> : <BadgeCheck size={17} />}
          {page.status === "approved" ? `Đã duyệt trang ${page.number}` : `Duyệt đạt Trang ${page.number}`}
        </button>
      </div>

      <div className="my-0.5 h-px bg-outline" />

      <div className="flex items-center justify-between text-xs text-navy/60">
        <span>Quyết định xuất bản toàn truyện:</span>
        <span className={`font-bold ${publishState.className}`}>{publishState.text}</span>
      </div>
      <div className="grid grid-cols-12 gap-1.5">
        <button
          onClick={() => onDecision("reject")}
          title="Từ chối xuất bản"
          className="col-span-3 flex items-center justify-center gap-1 rounded-full bg-danger-tint px-2 py-2 text-xs font-bold text-danger-dark transition hover:brightness-95"
        >
          <XCircle size={15} /> Từ chối
        </button>
        <button
          onClick={() => onDecision("revise")}
          className="col-span-4 flex items-center justify-center gap-1 rounded-full bg-outline/80 px-2 py-2 text-xs font-bold text-primary-dark transition hover:bg-primary-tint"
        >
          <NotebookPen size={15} /> Yêu cầu sửa
        </button>
        <button
          onClick={() => onDecision("publish")}
          disabled={!canPublish}
          title={canPublish ? "Phê duyệt xuất bản" : `Còn ${remaining} trang chưa duyệt đạt`}
          className="col-span-5 flex items-center justify-center gap-1 rounded-full bg-secondary px-2 py-2 text-sm font-bold text-white shadow-low transition hover:bg-secondary-dark disabled:cursor-not-allowed disabled:bg-outline disabled:text-navy/40 disabled:shadow-none"
        >
          {canPublish ? <BadgeCheck size={17} /> : <Lock size={16} />}
          PHÊ DUYỆT ({approvedCount}/{total})
        </button>
      </div>
      {!pageDone && <p className="text-center text-[11px] text-navy/50">Gợi ý: tích đủ checklist rồi bấm "Duyệt đạt" để chuyển sang trang kế tiếp.</p>}
      {pageDone && (
        <p className="flex items-center justify-center gap-1 text-center text-[11px] text-navy/50">
          <FilePenLine size={12} /> Trang này đã xử lý — chọn trang khác ở danh sách bên trái.
        </p>
      )}
    </div>
  );
}

export default ReviewActions;
