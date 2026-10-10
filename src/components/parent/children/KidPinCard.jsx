import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Lock, Pencil } from "lucide-react";
import Modal from "../../common/Modal";
import { changeKidPin, setKidPin } from "../../../services/authService";
import useAuthStore from "../../../stores/authStore";
import { toast } from "../../../stores/toastStore";
import SectionCard from "./SectionCard";

const pinInputClass =
  "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-3 text-center font-display text-2xl tracking-[0.5em] outline-none focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";
const textInputClass =
  "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-3 outline-none focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";

const PIN_REGEX = /^\d{4,6}$/;

// Đặt PIN lần đầu: POST /auth/kid-pin/set · Đổi PIN: PUT /auth/kid-pin/change (xác minh bằng PIN cũ hoặc mật khẩu tài khoản)
function PinModal({ hasPin, onClose, onSaved }) {
  const [verifyBy, setVerifyBy] = useState("pin"); // pin | password — khi quên PIN cũ
  const [form, setForm] = useState({ currentPin: "", password: "", pin: "", confirm: "" });
  const [error, setError] = useState("");

  const save = useMutation({
    mutationFn: () =>
      hasPin
        ? changeKidPin({
            newPin: form.pin,
            ...(verifyBy === "pin" ? { currentPin: form.currentPin } : { password: form.password }),
          })
        : setKidPin(form.pin),
    onSuccess: onSaved,
    onError: (err) => setError(err.message),
  });

  const setField = (key, digitsOnly) => (e) => {
    const value = digitsOnly ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    if (hasPin && verifyBy === "pin" && !PIN_REGEX.test(form.currentPin)) return setError("Ba mẹ nhập mã PIN hiện tại nhé");
    if (hasPin && verifyBy === "password" && !form.password) return setError("Ba mẹ nhập mật khẩu tài khoản nhé");
    if (!PIN_REGEX.test(form.pin)) return setError("Mã PIN gồm 4–6 chữ số");
    if (form.pin !== form.confirm) return setError("Hai mã PIN chưa khớp nhau");
    save.mutate();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={hasPin ? "Đổi mã PIN" : "Đặt mã PIN"}
      description="Dùng để thoát Chế độ Trẻ Em — áp dụng cho mọi hồ sơ bé"
      size="max-w-sm"
    >
      <form onSubmit={submit} className="space-y-4">
        {hasPin &&
          (verifyBy === "pin" ? (
            <label className="block">
              <span className="mb-1.5 flex items-center justify-between text-sm font-semibold">
                Mã PIN hiện tại
                <button type="button" onClick={() => setVerifyBy("password")} className="text-xs font-semibold text-primary-dark hover:underline">
                  Quên PIN?
                </button>
              </span>
              <input type="password" inputMode="numeric" autoFocus value={form.currentPin} onChange={setField("currentPin", true)} className={pinInputClass} />
            </label>
          ) : (
            <label className="block">
              <span className="mb-1.5 flex items-center justify-between text-sm font-semibold">
                Mật khẩu tài khoản
                <button type="button" onClick={() => setVerifyBy("pin")} className="text-xs font-semibold text-primary-dark hover:underline">
                  Dùng PIN cũ
                </button>
              </span>
              <input type="password" autoComplete="current-password" autoFocus value={form.password} onChange={setField("password")} className={textInputClass} />
            </label>
          ))}
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Mã PIN mới (4–6 số)</span>
          <input type="password" inputMode="numeric" autoFocus={!hasPin} value={form.pin} onChange={setField("pin", true)} className={pinInputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Nhập lại mã PIN mới</span>
          <input type="password" inputMode="numeric" value={form.confirm} onChange={setField("confirm", true)} className={pinInputClass} />
        </label>
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        <button type="submit" disabled={save.isPending} className="btn-primary w-full disabled:opacity-70">
          {save.isPending && <Loader2 size={18} className="animate-spin" />} Lưu mã PIN
        </button>
      </form>
    </Modal>
  );
}

/** Mã PIN thoát Kid Mode là của tài khoản phụ huynh (users.kid_exit_pin_hash), không theo từng bé */
function KidPinCard() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [open, setOpen] = useState(false);
  const hasPin = !!user?.hasKidPin; // từ GET /auth/me

  const handleSaved = () => {
    setOpen(false);
    setUser({ ...user, hasKidPin: true });
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    toast.success(hasPin ? "Đã đổi mã PIN thoát Kid Mode 🔒" : "Đã đặt mã PIN thoát Kid Mode 🔒");
  };

  return (
    <SectionCard icon={Lock} title="Mã PIN thoát Kid Mode" subtitle="Dùng chung cho mọi hồ sơ bé trong tài khoản">
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface p-4">
        <div>
          {hasPin ? (
            <span className="font-display text-lg font-bold tracking-widest text-navy/60">••••</span>
          ) : (
            <span className="text-sm font-bold text-red-600">Chưa đặt mã PIN</span>
          )}
          <p className="text-xs text-navy/60">Bé cần ba mẹ nhập PIN mới thoát được Chế độ Trẻ Em</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-low transition hover:bg-outline"
        >
          <Pencil size={14} /> {hasPin ? "Đổi PIN" : "Đặt PIN"}
        </button>
      </div>
      {open && <PinModal hasPin={hasPin} onClose={() => setOpen(false)} onSaved={handleSaved} />}
    </SectionCard>
  );
}

export default KidPinCard;
