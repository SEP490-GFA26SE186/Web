import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, RefreshCw, X } from "lucide-react";
import { PageHeader, Tabs } from "../../components/admin/AdminUi";
import api, { getErrorMessage } from "../../services/api";
import { toast } from "../../stores/toastStore";
import { formatNumber } from "../../utils/format";

const call = async (request) => {
  try {
    return (await request).data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

const TABS = [
  { value: "requested", label: "Chờ duyệt" },
  { value: "processing", label: "Đang chuyển" },
  { value: "paid", label: "Đã chuyển" },
  { value: "rejected", label: "Từ chối / thất bại" },
];

// Duyệt rút tiền người bán: Duyệt → BE tạo lệnh chi hộ payOS chuyển thẳng vào tài khoản người bán.
function WithdrawalsPage() {
  const [status, setStatus] = useState("requested");
  const [reasons, setReasons] = useState({});
  const queryClient = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", "withdrawals", status],
    queryFn: async () => (await call(api.get("/admin/withdrawals", { params: { status } }))).withdrawals,
  });
  const act = useMutation({
    mutationFn: ({ id, action, reason }) => call(api.post(`/admin/withdrawals/${id}/${action}`, action === "reject" ? { reason } : undefined)),
    onSuccess: (_, { action }) => {
      toast.success(action === "approve" ? "Đã gửi lệnh chi hộ payOS" : action === "reject" ? "Đã từ chối và trả tiền cho người bán" : "Đã cập nhật trạng thái");
      queryClient.invalidateQueries({ queryKey: ["admin", "withdrawals"] });
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <PageHeader title="Rút tiền người bán" description="Duyệt → hệ thống tạo lệnh chi hộ payOS chuyển thẳng vào tài khoản ngân hàng của người bán. Từ chối → tiền trả lại số dư người bán." />
      <Tabs value={status} onChange={setStatus} items={TABS} />
      <div className="card space-y-4 p-5">
      {isLoading && <Loader2 size={24} className="animate-spin text-primary" />}
      {!isLoading && rows.length === 0 && <p className="text-navy/60">Không có yêu cầu nào.</p>}
      <ul className="divide-y divide-outline">
        {rows.map((w) => {
          const busy = act.isPending && act.variables?.id === w.id;
          return (
            <li key={w.id} className="flex flex-wrap items-center gap-3 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-bold">
                  {formatNumber(w.amountVnd)}đ — {w.seller.displayName} <span className="font-normal text-navy/50">({w.seller.email})</span>
                </p>
                <p className="text-sm text-navy/60">
                  {w.bank.bankName} • {w.bank.accountNumber} • {w.bank.accountHolder} • {new Date(w.createdAt).toLocaleString("vi-VN")}
                </p>
                {w.rejectReason && <p className="text-sm text-danger">{w.rejectReason}</p>}
              </div>
              {status === "requested" && (
                <div className="flex flex-wrap items-center gap-2">
                  <input value={reasons[w.id] ?? ""} onChange={(e) => setReasons({ ...reasons, [w.id]: e.target.value })} placeholder="Lý do (khi từ chối)" aria-label="Lý do từ chối" className="rounded-card border-2 border-outline px-3 py-1.5 text-sm" />
                  <button type="button" disabled={busy} onClick={() => act.mutate({ id: w.id, action: "reject", reason: reasons[w.id] ?? "" })} className="btn-ghost px-3 py-1.5 text-sm text-danger">
                    <X size={15} /> Từ chối
                  </button>
                  <button type="button" disabled={busy} onClick={() => act.mutate({ id: w.id, action: "approve" })} className="btn-primary px-3 py-1.5 text-sm">
                    {busy ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Duyệt & chi hộ
                  </button>
                </div>
              )}
              {status === "processing" && (
                <button type="button" disabled={busy} onClick={() => act.mutate({ id: w.id, action: "sync" })} className="btn-ghost px-3 py-1.5 text-sm">
                  <RefreshCw size={15} /> Kiểm tra payOS
                </button>
              )}
            </li>
          );
        })}
      </ul>
      </div>
    </div>
  );
}

export default WithdrawalsPage;
