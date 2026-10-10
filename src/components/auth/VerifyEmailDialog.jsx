import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, MailCheck, RotateCw } from "lucide-react";
import Modal from "../common/Modal";
import { sendVerificationEmail, verifyEmail } from "../../services/authService";
import useAuthStore from "../../stores/authStore";
import { toast } from "../../stores/toastStore";

/**
 * Xác thực email: BE gửi mã (hạn 24 giờ) qua email lúc đăng ký / khi bấm gửi lại.
 * Người dùng dán mã vào đây → POST /auth/verify-email. Gửi lại mã thì mã cũ hết hiệu lực.
 */
function VerifyEmailDialog({ onClose }) {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const verify = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      setUser({ ...user, emailVerifiedAt: data?.emailVerifiedAt ?? new Date().toISOString() });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (err) => setError(err.message),
  });

  const resend = useMutation({
    mutationFn: () => sendVerificationEmail(user.email),
    onSuccess: () => {
      setToken("");
      setError("");
      toast.success(`Đã gửi mã mới tới ${user.email}`);
    },
    onError: (err) => setError(err.message),
  });

  const submit = (e) => {
    e.preventDefault();
    if (!token.trim()) return setError("Ba mẹ dán mã xác thực trong email vào nhé");
    verify.mutate(token.trim());
  };

  if (verify.isSuccess) {
    return (
      <Modal open onClose={onClose} title="Xác thực email" size="max-w-md">
        <div role="status" className="flex flex-col items-center gap-2 py-4 text-center">
          <CheckCircle2 size={44} className="text-secondary" />
          <p className="font-display text-lg font-bold">Email đã được xác thực!</p>
          <p className="text-sm text-navy/70">Cảm ơn ba mẹ, tài khoản đã sẵn sàng.</p>
          <button onClick={onClose} className="btn-primary mt-3 py-2.5">
            Đóng
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Xác thực email"
      description={`StoryWeaver đã gửi mã xác thực tới ${user?.email}. Mã có hiệu lực trong 24 giờ.`}
      size="max-w-md"
    >
      <form onSubmit={submit} noValidate className="flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">Mã xác thực</span>
          <input
            autoFocus
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setError("");
            }}
            placeholder="Dán mã trong email"
            className="w-full rounded-2xl bg-surface px-4 py-3 font-mono text-sm outline-none placeholder:font-sans placeholder:text-muted/60 focus:bg-white focus:ring-[3px] focus:ring-secondary/20"
          />
        </label>
        {error && <p className="text-sm font-semibold text-danger">{error}</p>}
        <button type="submit" disabled={verify.isPending} className="btn-primary mt-1 w-full py-3 disabled:opacity-60">
          {verify.isPending ? <Loader2 size={18} className="animate-spin" /> : <MailCheck size={18} />} Xác thực
        </button>
        <button
          type="button"
          onClick={() => resend.mutate()}
          disabled={resend.isPending}
          className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-primary-dark hover:underline disabled:opacity-60"
        >
          {resend.isPending ? <Loader2 size={14} className="animate-spin" /> : <RotateCw size={14} />} Không thấy email? Gửi lại mã
        </button>
      </form>
    </Modal>
  );
}

export default VerifyEmailDialog;
