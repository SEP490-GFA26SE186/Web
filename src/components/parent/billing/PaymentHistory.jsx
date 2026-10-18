import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, ReceiptText, Undo2 } from "lucide-react";
import { getMyOrders, requestRefund } from "../../../services/billingService";
import { toast } from "../../../stores/toastStore";
import { formatNumber } from "../../../utils/format";

const REFUND_STATUS = {
  pending: { label: "Đang chờ hoàn tiền", tone: "bg-primary-tint text-primary-dark" },
  approved: { label: "Đã hoàn tiền", tone: "bg-secondary-tint text-secondary-dark" },
  rejected: { label: "Không được hoàn", tone: "bg-danger-tint text-danger" },
};
const date = (iso) => new Date(iso).toLocaleDateString("vi-VN");

function RefundForm({ item, onDone }) {
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();
  const send = useMutation({
    mutationFn: () => requestRefund(item.id, reason.trim()),
    onSuccess: () => {
      toast.success("Đã gửi yêu cầu hoàn tiền. Quản trị viên sẽ chuyển trả vào tài khoản đã thanh toán.");
      queryClient.invalidateQueries({ queryKey: ["billing", "orders"] });
      onDone();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (reason.trim().length < 10) return toast.error("Ba mẹ ghi lý do ít nhất 10 ký tự nhé");
        send.mutate();
      }}
      className="mt-2 space-y-2"
    >
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={2}
        maxLength={2000}
        placeholder="Lý do hoàn tiền (VD: mua nhầm gói, truyện không như mô tả...)"
        aria-label="Lý do hoàn tiền"
        className="w-full resize-none rounded-card border-2 border-outline p-3 text-sm"
      />
      <div className="flex gap-2">
        <button type="submit" disabled={send.isPending} className="btn-primary px-4 py-2 text-sm">
          {send.isPending && <Loader2 size={15} className="animate-spin" />} Gửi yêu cầu
        </button>
        <button type="button" onClick={onDone} className="btn-ghost px-4 py-2 text-sm">Hủy</button>
      </div>
    </form>
  );
}

// Lịch sử thanh toán (đơn có phí) + yêu cầu hoàn tiền trong thời hạn.
function PaymentHistory() {
  const [open, setOpen] = useState(null);
  const { data, isLoading } = useQuery({ queryKey: ["billing", "orders"], queryFn: getMyOrders });
  if (isLoading) return <Loader2 size={24} className="animate-spin text-primary" />;
  if (!data?.orders.length) return null;

  return (
    <section className="card space-y-3 p-6">
      <h2 className="flex items-center gap-2 text-lg">
        <ReceiptText size={20} className="text-primary" /> Lịch sử thanh toán
      </h2>
      <p className="text-sm text-navy/60">Ba mẹ có thể yêu cầu hoàn tiền trong {data.refundWindowDays} ngày kể từ lúc thanh toán.</p>
      <ul className="divide-y divide-outline">
        {data.orders.flatMap((o) =>
          o.items.map((i) => {
            const st = i.refund && REFUND_STATUS[i.refund.status];
            return (
              <li key={i.id} className="py-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-bold">{i.itemType === "plan" ? `Gói ${i.title}` : `Truyện “${i.title}”`}</span>
                  <span className="text-navy/60">
                    {formatNumber(i.unitPriceVnd)}đ • {date(o.paidAt)} • mã {o.payosOrderCode}
                  </span>
                  {st && <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${st.tone}`}>{st.label}</span>}
                  {i.refundable && open !== i.id && (
                    <button type="button" onClick={() => setOpen(i.id)} className="ml-auto inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                      <Undo2 size={14} /> Yêu cầu hoàn tiền (đến {date(i.deadline)})
                    </button>
                  )}
                </div>
                {i.refund?.decisionNote && <p className="mt-1 text-sm text-navy/70">Quản trị viên: {i.refund.decisionNote}</p>}
                {open === i.id && <RefundForm item={i} onDone={() => setOpen(null)} />}
              </li>
            );
          }),
        )}
      </ul>
    </section>
  );
}

export default PaymentHistory;
