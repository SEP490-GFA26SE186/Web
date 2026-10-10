import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Send } from "lucide-react";
import Modal from "../common/Modal";
import { EMAIL_REGEX, MIN_REGISTER_PASSWORD, requestPasswordReset, resetPassword } from "../../services/authService";

const inputClass =
  "w-full rounded-2xl bg-surface px-4 py-3 outline-none placeholder:text-muted/60 focus:bg-white focus:ring-[3px] focus:ring-secondary/20";

/**
 * Quên mật khẩu — 3 bước:
 * 1. Nhập email → BE gửi mã khôi phục (hạn 1 giờ)
 * 2. Dán mã + đặt mật khẩu mới
 * 3. Xong → đăng nhập lại (BE đã thu hồi mọi phiên đăng nhập cũ)
 */
function ForgotPasswordDialog({ defaultIdentity = "", onClose }) {
  const [step, setStep] = useState("request"); // request | reset | done
  const [email, setEmail] = useState(EMAIL_REGEX.test(defaultIdentity) ? defaultIdentity : "");
  const [form, setForm] = useState({ token: "", newPassword: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const request = useMutation({ mutationFn: requestPasswordReset, onSuccess: () => setStep("reset") });
  const reset = useMutation({ mutationFn: resetPassword, onSuccess: () => setStep("done") });

  const submitRequest = (e) => {
    e.preventDefault();
    if (!EMAIL_REGEX.test(email.trim())) return setError("Email chưa đúng định dạng");
    setError("");
    request.mutate(email.trim(), { onError: (err) => setError(err.message) });
  };

  const submitReset = (e) => {
    e.preventDefault();
    if (!form.token.trim()) return setError("Ba mẹ dán mã khôi phục trong email vào nhé");
    if (form.newPassword.length < MIN_REGISTER_PASSWORD) return setError(`Mật khẩu mới có ít nhất ${MIN_REGISTER_PASSWORD} ký tự`);
    if (form.newPassword !== form.confirm) return setError("Mật khẩu nhập lại chưa khớp");
    setError("");
    reset.mutate({ token: form.token.trim(), newPassword: form.newPassword }, { onError: (err) => setError(err.message) });
  };

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError("");
  };

  const errorText = error && <p className="text-sm font-semibold text-danger">{error}</p>;

  if (step === "done") {
    return (
      <Modal open onClose={onClose} title="Đặt lại mật khẩu" size="max-w-md">
        <div role="status" className="flex flex-col items-center gap-2 py-4 text-center">
          <CheckCircle2 size={44} className="text-secondary" />
          <p className="font-display text-lg font-bold">Đã đặt lại mật khẩu!</p>
          <p className="text-sm text-navy/70">Ba mẹ đăng nhập lại bằng mật khẩu mới nhé.</p>
          <button onClick={onClose} className="btn-primary mt-3 py-2.5">
            Quay lại đăng nhập
          </button>
        </div>
      </Modal>
    );
  }

  if (step === "reset") {
    return (
      <Modal
        open
        onClose={onClose}
        title="Đặt mật khẩu mới"
        description={email ? `Mã khôi phục đã gửi tới ${email}, có hiệu lực trong 1 giờ.` : "Dán mã khôi phục trong email (hiệu lực 1 giờ)."}
        size="max-w-md"
      >
        <form onSubmit={submitReset} noValidate className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">Mã khôi phục</span>
            <input autoFocus value={form.token} onChange={set("token")} placeholder="Dán mã trong email" className={`${inputClass} font-mono text-sm`} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">Mật khẩu mới</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.newPassword}
                onChange={set("newPassword")}
                placeholder={`Ít nhất ${MIN_REGISTER_PASSWORD} ký tự`}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted hover:text-navy"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">Nhập lại mật khẩu mới</span>
            <input type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.confirm} onChange={set("confirm")} className={inputClass} />
          </label>
          {errorText}
          <button type="submit" disabled={reset.isPending} className="btn-primary mt-1 w-full py-3 disabled:opacity-60">
            {reset.isPending ? <Loader2 size={18} className="animate-spin" /> : <KeyRound size={18} />} Đặt lại mật khẩu
          </button>
          <button
            type="button"
            onClick={() => {
              setStep("request");
              setError("");
            }}
            className="text-sm font-semibold text-primary-dark hover:underline"
          >
            Chưa nhận được mã? Gửi lại
          </button>
        </form>
      </Modal>
    );
  }

  return (
    <Modal open onClose={onClose} title="Quên mật khẩu?" description="Nhập email đã đăng ký, StoryWeaver sẽ gửi mã khôi phục mật khẩu." size="max-w-md">
      <form onSubmit={submitRequest} noValidate className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">Email</span>
          <input
            type="email"
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="ba_me@email.com"
            className={inputClass}
          />
        </label>
        {errorText}
        <button type="submit" disabled={!email.trim() || request.isPending} className="btn-primary mt-1 w-full py-3 disabled:opacity-60">
          {request.isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} Gửi mã khôi phục
        </button>
        <button
          type="button"
          onClick={() => {
            setStep("reset");
            setError("");
          }}
          className="text-sm font-semibold text-primary-dark hover:underline"
        >
          Đã có mã khôi phục? Nhập mã
        </button>
      </form>
    </Modal>
  );
}

export default ForgotPasswordDialog;
