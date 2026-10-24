import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Copy, Loader2, X } from "lucide-react";
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
  { value: "requested", label: "Chờ chuyển khoản" },
  { value: "paid", label: "Đã chuyển" },
  { value: "rejected", label: "Từ chối" },
];

// Nội dung chuyển khoản: ngắn, không dấu, đủ để người bán nhận ra và Admin đối soát.
const transferNote = (w) => `StoryWeaver rut tien ${w.id.slice(0, 8)}`;

// Ảnh VietQR (img.vietqr.io): quét bằng app ngân hàng là điền sẵn ngân hàng, số tài khoản, số tiền, nội dung.
const vietQrUrl = (w) =>
  `https://img.vietqr.io/image/${w.bank.bankBin}-${w.bank.accountNumber}-compact2.png?amount=${w.amountVnd}` +
  `&addInfo=${encodeURIComponent(transferNote(w))}&accountName=${encodeURIComponent(w.bank.accountHolder ?? "")}`;

function CopyValue({ label, value }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
      toast.success(`Đã chép ${label.toLowerCase()}`);
    } catch {
      toast.error("Không chép được, hãy bôi đen để chép");
    }
  };
  return (
    <div className="flex items-center justify-between gap-2 rounded-card bg-surface px-3 py-2">
      <div className="min-w-0">
        <p className="text-xs text-navy/55">{label}</p>
        <p className="truncate font-bold">{value}</p>
      </div>
      <button type="button" onClick={copy} className="rounded-full p-1.5 text-navy/60 hover:bg-white hover:text-navy" aria-label={`Chép ${label}`}>
        <Copy size={15} />
      </button>
    </div>
  );
}

function PendingWithdrawal({ w, act }) {
  const [ref, setRef] = useState("");
  const [reason, setReason] = useState("");
  const busy = act.isPending && act.variables?.id === w.id;
  const markPaid = () => {
    if (!window.confirm(`Xác nhận đã chuyển ${formatNumber(w.amountVnd)}đ cho ${w.bank.accountHolder}?`)) return;
    act.mutate({ id: w.id, action: "mark-paid", body: ref.trim() ? { bankTransactionRef: ref.trim() } : {} });
  };
  return (
    <li className="grid gap-4 py-5 md:grid-cols-[1fr_auto]">
      <div className="min-w-0 space-y-3">
        <p className="font-bold">
          {formatNumber(w.amountVnd)}đ — {w.seller.displayName} <span className="font-normal text-navy/50">({w.seller.email})</span>
        </p>
        <p className="text-sm text-navy/60">Yêu cầu lúc {new Date(w.createdAt).toLocaleString("vi-VN")}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <CopyValue label="Ngân hàng" value={w.bank.bankName} />
          <CopyValue label="Số tài khoản" value={w.bank.accountNumber} />
          <CopyValue label="Chủ tài khoản" value={w.bank.accountHolder} />
          <CopyValue label="Số tiền" value={w.amountVnd} />
          <div className="sm:col-span-2">
            <CopyValue label="Nội dung chuyển khoản" value={transferNote(w)} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input value={ref} onChange={(e) => setRef(e.target.value)} maxLength={100} placeholder="Mã giao dịch ngân hàng (tuỳ chọn)" aria-label="Mã giao dịch ngân hàng" className="min-w-0 flex-1 rounded-card border-2 border-outline px-3 py-1.5 text-sm" />
          <button type="button" disabled={busy} onClick={markPaid} className="btn-primary px-3 py-1.5 text-sm">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Đã chuyển khoản
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Lý do (khi từ chối)" aria-label="Lý do từ chối" className="min-w-0 flex-1 rounded-card border-2 border-outline px-3 py-1.5 text-sm" />
          <button type="button" disabled={busy} onClick={() => act.mutate({ id: w.id, action: "reject", body: { reason } })} className="btn-ghost px-3 py-1.5 text-sm text-danger">
            <X size={15} /> Từ chối
          </button>
        </div>
      </div>
      {w.bank.bankBin && (
        <figure className="justify-self-center text-center">
          <img src={vietQrUrl(w)} alt="Mã VietQR chuyển khoản" width={220} height={220} className="rounded-card border border-outline bg-white" loading="lazy" />
          <figcaption className="mt-1 text-xs text-navy/55">Quét bằng app ngân hàng</figcaption>
        </figure>
      )}
    </li>
  );
}

// Rút tiền người bán: Admin tự chuyển khoản bằng app ngân hàng rồi bấm "Đã chuyển khoản"; từ chối → tiền trả lại số dư người bán.
function WithdrawalsPage() {
  const [status, setStatus] = useState("requested");
  const queryClient = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", "withdrawals", status],
    queryFn: async () => (await call(api.get("/admin/withdrawals", { params: { status } }))).withdrawals,
  });
  const act = useMutation({
    mutationFn: ({ id, action, body }) => call(api.post(`/admin/withdrawals/${id}/${action}`, body)),
    onSuccess: (_, { action }) => {
      toast.success(action === "mark-paid" ? "Đã ghi nhận chuyển khoản" : "Đã từ chối và trả tiền cho người bán");
      queryClient.invalidateQueries({ queryKey: ["admin", "withdrawals"] });
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Rút tiền người bán"
        description="Chuyển khoản bằng app ngân hàng (quét mã QR hoặc chép thông tin), rồi bấm “Đã chuyển khoản”. Từ chối → tiền trả lại số dư người bán."
      />
      <Tabs value={status} onChange={setStatus} items={TABS} />
      <div className="card space-y-4 p-5">
        {isLoading && <Loader2 size={24} className="animate-spin text-primary" />}
        {!isLoading && rows.length === 0 && <p className="text-navy/60">Không có yêu cầu nào.</p>}
        <ul className="divide-y divide-outline">
          {rows.map((w) =>
            status === "requested" ? (
              <PendingWithdrawal key={w.id} w={w} act={act} />
            ) : (
              <li key={w.id} className="py-4">
                <p className="font-bold">
                  {formatNumber(w.amountVnd)}đ — {w.seller.displayName} <span className="font-normal text-navy/50">({w.seller.email})</span>
                </p>
                <p className="text-sm text-navy/60">
                  {w.bank.bankName} • {w.bank.accountNumber} • {w.bank.accountHolder}
                  {w.handledAt && <> • xử lý {new Date(w.handledAt).toLocaleString("vi-VN")}</>}
                  {w.bankTransactionRef && <> • mã GD {w.bankTransactionRef}</>}
                </p>
                {w.rejectReason && <p className="text-sm text-danger">{w.rejectReason}</p>}
              </li>
            ),
          )}
        </ul>
      </div>
    </div>
  );
}

export default WithdrawalsPage;
