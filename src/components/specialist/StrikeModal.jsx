import { useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "../common/Modal";
import { STRIKE_SOURCES } from "../../constants/moderation";
import { useIssueStrike } from "../../hooks/useSpecialist";
import { toast } from "../../stores/toastStore";
import { Select } from "../ui";

/**
 * Cảnh cáo tác giả. `seller` = { id, displayName } cố định (từ báo cáo / truyện bị gỡ), hoặc truyền
 * `sellers` để chuyên gia chọn. Cảnh cáo hiệu lực 90 ngày; đủ 3 → BE khoá tài khoản bán.
 */
function StrikeModal({ seller, sellers, source = "report", sourceId, defaultReason = "", onClose }) {
  const [sellerId, setSellerId] = useState(seller?.id ?? "");
  const [reason, setReason] = useState(defaultReason);
  const issue = useIssueStrike();

  const submit = (e) => {
    e.preventDefault();
    if (!sellerId) return toast.error("Chọn người bán");
    if (reason.trim().length < 10) return toast.error("Lý do cảnh cáo tối thiểu 10 ký tự");
    issue.mutate(
      { sellerId, source, ...(sourceId && { sourceId }), reason: reason.trim() },
      {
        onSuccess: ({ activeStrikes, strikeLimit, sellerSuspended }) => {
          toast.success(
            sellerSuspended
              ? `Đã cảnh cáo — đủ ${strikeLimit} cảnh cáo, tài khoản bán đã bị khoá`
              : `Đã cảnh cáo (${activeStrikes}/${strikeLimit} cảnh cáo còn hiệu lực)`,
          );
          onClose();
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Cảnh cáo tác giả"
      description={`Nguồn: ${STRIKE_SOURCES[source]}. Cảnh cáo hiệu lực 90 ngày, người bán thấy lý do và được kháng nghị một lần.`}
      size="max-w-lg"
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Hủy
          </button>
          <button type="submit" form="strike-form" disabled={issue.isPending} className="inline-flex items-center gap-1.5 rounded-full bg-danger px-5 py-2.5 text-sm font-bold text-white hover:bg-danger-dark disabled:opacity-70">
            {issue.isPending && <Loader2 size={16} className="animate-spin" />} Cảnh cáo
          </button>
        </>
      }
    >
      <form id="strike-form" onSubmit={submit} className="space-y-3">
        {seller ? (
          <p className="text-sm">
            Người bán: <b>{seller.displayName}</b>
          </p>
        ) : (
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Người bán</span>
            <Select
              value={sellerId}
              onChange={setSellerId}
              placeholder="Chọn người bán"
              options={(sellers ?? []).map((s) => ({ value: s.userId, label: s.displayName }))}
            />
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Lý do (người bán sẽ đọc)</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="VD: Trang 3 mô tả cảnh đánh nhau chi tiết, gây sợ cho trẻ 5 tuổi."
            className="w-full resize-none rounded-2xl border-[1.5px] border-outline px-4 py-2.5 text-sm"
          />
        </label>
      </form>
    </Modal>
  );
}

export default StrikeModal;
