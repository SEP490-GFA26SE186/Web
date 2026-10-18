import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Banknote, Clock, Landmark, Loader2, Wallet, X } from "lucide-react";
import api, { getErrorMessage } from "../../../services/api";
import { BANKS } from "../../../constants/banks";
import { toast } from "../../../stores/toastStore";
import { formatNumber } from "../../../utils/format";

const call = async (request) => {
  try {
    return (await request).data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

const STATUS = {
  requested: { label: "Chờ Admin duyệt", tone: "bg-navy-tint text-navy" },
  processing: { label: "Đang chuyển tiền", tone: "bg-primary-tint text-primary-dark" },
  paid: { label: "Đã chuyển", tone: "bg-secondary-tint text-secondary-dark" },
  rejected: { label: "Bị từ chối", tone: "bg-danger-tint text-danger" },
  cancelled: { label: "Đã huỷ", tone: "bg-surface text-navy/60" },
};
const field = "w-full rounded-card border-2 border-outline px-4 py-2.5 focus:border-primary focus:outline-none";
const money = (v) => `${formatNumber(v ?? 0)}đ`;

function BankForm({ current, onDone }) {
  const [form, setForm] = useState({ bankBin: current?.bankBin ?? "", accountNumber: "", accountHolder: current?.accountHolder ?? "" });
  const save = useMutation({ mutationFn: (body) => call(api.put("/sellers/me/bank", body)) });
  const submit = (e) => {
    e.preventDefault();
    const bank = BANKS.find((b) => b.bin === form.bankBin);
    save.mutate(
      { ...form, bankName: bank?.name ?? "" },
      { onSuccess: () => { toast.success("Đã lưu tài khoản nhận tiền"); onDone(); }, onError: (err) => toast.error(err.message) },
    );
  };
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-3">
      <select required value={form.bankBin} onChange={(e) => setForm({ ...form, bankBin: e.target.value })} className={field} aria-label="Ngân hàng">
        <option value="">— Ngân hàng —</option>
        {BANKS.map((b) => (
          <option key={b.bin} value={b.bin}>
            {b.name}
          </option>
        ))}
      </select>
      <input required inputMode="numeric" value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value.trim() })} placeholder="Số tài khoản" aria-label="Số tài khoản" className={field} />
      <input required value={form.accountHolder} onChange={(e) => setForm({ ...form, accountHolder: e.target.value })} placeholder="Tên chủ tài khoản" aria-label="Tên chủ tài khoản" className={field} />
      <button type="submit" disabled={save.isPending} className="btn-primary sm:col-span-3 sm:justify-self-start">
        {save.isPending && <Loader2 size={16} className="animate-spin" />} Lưu tài khoản
      </button>
    </form>
  );
}

// Doanh thu người bán: chờ (giữ vài ngày) → rút được → rút qua chi hộ payOS (Admin duyệt).
function EarningsPanel() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["selling", "earnings"], queryFn: () => call(api.get("/sellers/me/earnings")) });
  const [editBank, setEditBank] = useState(false);
  const [amount, setAmount] = useState("");
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["selling", "earnings"] });
  const withdraw = useMutation({ mutationFn: (amountVnd) => call(api.post("/sellers/me/withdrawals", { amountVnd })) });
  const cancel = useMutation({ mutationFn: (id) => call(api.delete(`/sellers/me/withdrawals/${id}`)) });

  if (isLoading) return <Loader2 size={24} className="animate-spin text-primary" />;
  if (!data) return null;
  const { balance, bank, withdrawals, minWithdrawalVnd, holdDays, sellerShareRate } = data;

  const submitWithdraw = (e) => {
    e.preventDefault();
    withdraw.mutate(Number(amount), {
      onSuccess: () => { toast.success("Đã gửi yêu cầu rút tiền"); setAmount(""); refresh(); },
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <section className="card space-y-5 p-6">
      <h2 className="flex items-center gap-2 text-lg">
        <Wallet size={20} className="text-primary" /> Doanh thu
      </h2>
      <p className="text-sm text-navy/60">
        Ba mẹ nhận {Math.round(sellerShareRate * 100)}% giá bán mỗi lượt mua. Doanh thu được giữ {holdDays} ngày (để xử lý hoàn tiền) rồi mới rút được.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: Clock, label: "Đang giữ", value: balance.pendingVnd },
          { icon: Banknote, label: "Rút được", value: balance.availableVnd },
          { icon: Landmark, label: "Đang rút", value: balance.lockedVnd },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-card bg-surface p-4">
            <p className="flex items-center gap-1 text-sm text-navy/60">
              <Icon size={15} /> {label}
            </p>
            <p className="font-display text-xl font-bold">{money(value)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h3 className="font-bold">Tài khoản nhận tiền</h3>
        {bank && !editBank ? (
          <p className="text-sm">
            {bank.bankName} • {bank.accountNumber} • {bank.accountHolder}{" "}
            <button type="button" onClick={() => setEditBank(true)} className="ml-2 font-bold text-primary hover:underline">
              Đổi
            </button>
          </p>
        ) : (
          <>
            {bank && <p className="text-sm text-navy/60">Đổi tài khoản thì 24 giờ sau mới rút được.</p>}
            <BankForm current={bank} onDone={() => { setEditBank(false); refresh(); }} />
          </>
        )}
      </div>

      {bank && (
        <form onSubmit={submitWithdraw} className="flex flex-wrap items-end gap-3">
          <label className="min-w-48 flex-1">
            <span className="mb-1 block text-sm font-semibold">Số tiền rút (tối thiểu {money(minWithdrawalVnd)})</span>
            <input type="number" required min={minWithdrawalVnd} max={balance.availableVnd} step={1000} value={amount} onChange={(e) => setAmount(e.target.value)} className={field} />
          </label>
          <button type="submit" disabled={withdraw.isPending || balance.availableVnd < minWithdrawalVnd} className="btn-primary disabled:opacity-50">
            {withdraw.isPending && <Loader2 size={16} className="animate-spin" />} Rút tiền
          </button>
        </form>
      )}

      {withdrawals.length > 0 && (
        <ul className="divide-y divide-outline text-sm">
          {withdrawals.map((w) => {
            const s = STATUS[w.status] ?? { label: w.status, tone: "bg-surface" };
            return (
              <li key={w.id} className="flex flex-wrap items-center gap-2 py-2">
                <span className="font-bold">{money(w.amountVnd)}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${s.tone}`}>{s.label}</span>
                <span className="text-navy/50">{new Date(w.createdAt).toLocaleString("vi-VN")}</span>
                {w.rejectReason && <span className="text-danger">— {w.rejectReason}</span>}
                {w.status === "requested" && (
                  <button type="button" onClick={() => cancel.mutate(w.id, { onSuccess: refresh, onError: (e) => toast.error(e.message) })} className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-navy/60 hover:text-danger">
                    <X size={14} /> Huỷ
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default EarningsPanel;
