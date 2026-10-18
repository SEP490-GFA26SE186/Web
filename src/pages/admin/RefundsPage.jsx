import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { LoadState, PageHeader, Tabs } from "../../components/admin/AdminUi";
import { fieldClass, formatDateTime, money } from "../../components/admin/adminFormat";
import { useDecideRefund, useRefunds } from "../../hooks/useAdmin";
import { toast } from "../../stores/toastStore";

const TABS = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "approved", label: "Đã hoàn" },
  { value: "rejected", label: "Đã từ chối" },
];
const EARNING = { pending: "đang giữ — sẽ trừ lại", available: "đã mở khoá — trừ từ số rút được", none: "không có" };

function RefundRow({ r }) {
  const [ref, setRef] = useState("");
  const [note, setNote] = useState("");
  const decide = useDecideRefund();
  const act = (approve) =>
    decide.mutate(
      { id: r.id, approve, bankTransactionRef: ref.trim() || undefined, note: note.trim() || undefined },
      { onSuccess: () => toast.success(approve ? "Đã hoàn tiền" : "Đã từ chối yêu cầu"), onError: (e) => toast.error(e.message) },
    );
  const i = r.item;
  return (
    <li className="space-y-3 py-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-bold">
            {money(i.unitPriceVnd)} — {i.itemType === "plan" ? `Gói ${i.title}` : `Truyện “${i.title}”`}
            {i.seller && <span className="font-normal text-navy/60"> của {i.seller}</span>}
          </p>
          <p className="text-sm text-navy/60">
            {r.requester.fullName} ({r.requester.email}) • trả lúc {formatDateTime(i.paidAt)} • mã payOS {i.payosOrderCode ?? "—"} • yêu cầu {formatDateTime(r.createdAt)}
          </p>
        </div>
        {r.status !== "pending" && (
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${r.status === "approved" ? "bg-secondary-tint text-secondary-dark" : "bg-danger-tint text-danger"}`}>
            {r.status === "approved" ? `Đã hoàn • ${r.bankTransactionRef}` : "Đã từ chối"}
          </span>
        )}
      </div>
      <p className="rounded-card bg-surface p-3 text-sm">“{r.reason}”</p>
      {r.impact && (
        <p className="text-sm text-navy/70">
          {i.itemType === "plan"
            ? `Gói đang ${r.impact.subscriptionStatus === "active" ? "dùng" : r.impact.subscriptionStatus ?? "—"}, đã dùng ${r.impact.creditsUsed} credit trong kỳ. Duyệt: huỷ gói, xoá credit còn lại, chuyển về gói Miễn phí.`
            : `Doanh thu người bán ${money(r.impact.sellerEarning)} ${EARNING[r.impact.earningState]}. Duyệt: thu hồi quyền đọc, gỡ khỏi giá sách của bé.`}
        </p>
      )}
      {r.decisionNote && <p className="text-sm text-navy/70">Ghi chú: {r.decisionNote} {r.handler && `— ${r.handler}`}</p>}
      {r.status === "pending" && (
        <div className="space-y-2 rounded-card border-2 border-dashed border-outline p-3">
          <p className="text-sm">
            Chuyển trả thủ công vào:{" "}
            {r.payer ? (
              <b>{r.payer.accountNumber} • {r.payer.accountName} • {r.payer.bankName}</b>
            ) : (
              <span className="text-navy/60">không có STK người trả trong webhook payOS — liên hệ phụ huynh qua email để lấy STK.</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Mã giao dịch đã chuyển trả" aria-label="Mã giao dịch" className={`${fieldClass} min-w-52 flex-1 rounded-full`} />
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú cho phụ huynh (bắt buộc khi từ chối)" aria-label="Ghi chú" className={`${fieldClass} min-w-64 flex-[2] rounded-full`} />
          </div>
          <div className="flex gap-2">
            <button type="button" disabled={decide.isPending} onClick={() => act(true)} className="btn-primary px-4 py-2 text-sm">
              {decide.isPending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Đã chuyển trả — duyệt
            </button>
            <button type="button" disabled={decide.isPending} onClick={() => act(false)} className="btn-ghost px-4 py-2 text-sm text-danger">
              <X size={15} /> Từ chối
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

// Hoàn tiền: payOS VietQR không có API hoàn → Admin chuyển trả thủ công rồi nhập mã giao dịch; hệ thống thu hồi quyền lợi.
function RefundsPage() {
  const [status, setStatus] = useState("pending");
  const { data: rows = [], isLoading, error } = useRefunds(status);
  return (
    <div className="space-y-5">
      <PageHeader title="Yêu cầu hoàn tiền" description="Phụ huynh gửi trong thời hạn cấu hình (mặc định 3 ngày, bằng số ngày giữ doanh thu người bán). Doanh thu của giao dịch đang chờ xử lý không được mở khoá.">
        <Tabs value={status} onChange={setStatus} items={TABS} />
      </PageHeader>
      <section className="card px-5">
        <LoadState isLoading={isLoading} error={error} empty={!rows.length} emptyText="Không có yêu cầu nào." />
        <ul className="divide-y divide-outline">
          {rows.map((r) => <RefundRow key={r.id} r={r} />)}
        </ul>
      </section>
    </div>
  );
}

export default RefundsPage;
