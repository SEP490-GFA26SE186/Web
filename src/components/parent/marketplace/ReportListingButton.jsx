import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Flag, Loader2 } from "lucide-react";
import Modal from "../../common/Modal";
import { REPORT_CATEGORIES } from "../../../constants/moderation";
import { reportListing } from "../../../services/marketplaceService";
import { toast } from "../../../stores/toastStore";

/**
 * Phụ huynh báo cáo truyện đang bán (mỗi người một lần / truyện). Đủ nhiều phụ huynh báo cáo thì truyện tự
 * tạm gỡ chờ kiểm duyệt viên xem lại.
 */
function ReportListingButton({ listingId }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [sent, setSent] = useState(false);
  const report = useMutation({ mutationFn: (body) => reportListing(listingId, body) });

  const submit = (e) => {
    e.preventDefault();
    if (!category) return toast.error("Ba mẹ chọn loại vấn đề giúp nhé");
    report.mutate(
      { category, description: description.trim() || undefined },
      {
        onSuccess: () => {
          toast.success("Cảm ơn ba mẹ! Kiểm duyệt viên sẽ xem lại truyện này.");
          setSent(true);
          setOpen(false);
        },
        onError: (err) => {
          if (err.status === 409) setSent(true);
          toast.error(err.message);
        },
      },
    );
  };

  if (sent) return <p className="flex items-center gap-1.5 text-sm text-navy/50"><Flag size={14} /> Ba mẹ đã báo cáo truyện này</p>;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy/50 hover:text-danger">
        <Flag size={14} /> Báo cáo nội dung không phù hợp
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Báo cáo truyện"
        description="Thông tin của ba mẹ không được gửi cho người bán."
        size="max-w-md"
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
              Hủy
            </button>
            <button type="submit" form="report-form" disabled={report.isPending} className="inline-flex items-center gap-1.5 rounded-full bg-danger px-5 py-2.5 text-sm font-bold text-white hover:bg-danger-dark disabled:opacity-70">
              {report.isPending && <Loader2 size={16} className="animate-spin" />} Gửi báo cáo
            </button>
          </>
        }
      >
        <form id="report-form" onSubmit={submit} className="space-y-3">
          <fieldset className="grid gap-2 sm:grid-cols-2">
            <legend className="mb-1.5 text-sm font-semibold">Vấn đề là gì?</legend>
            {Object.entries(REPORT_CATEGORIES).map(([value, label]) => (
              <label key={value} className={`flex cursor-pointer items-center gap-2 rounded-2xl border-[1.5px] px-3 py-2 text-sm ${category === value ? "border-danger bg-danger-tint" : "border-outline"}`}>
                <input type="radio" name="category" value={value} checked={category === value} onChange={() => setCategory(value)} />
                {label}
              </label>
            ))}
          </fieldset>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Mô tả thêm (không bắt buộc), VD: trang 3 có cảnh làm bé sợ"
            aria-label="Mô tả thêm"
            className="w-full resize-none rounded-2xl border-[1.5px] border-outline px-4 py-2.5 text-sm"
          />
        </form>
      </Modal>
    </>
  );
}

export default ReportListingButton;
