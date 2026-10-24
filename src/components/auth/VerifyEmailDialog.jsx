import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Modal from "../common/Modal";
import { sendVerificationEmail, verifyEmail } from "../../services/authService";
import useAuthStore from "../../stores/authStore";
import { toast } from "../../stores/toastStore";

/**
 * Xác thực email: BE gửi mã (hạn 24 giờ) qua email lúc đăng ký / khi bấm gửi lại.
 * Người dùng dán mã vào đây → POST /auth/verify-email. Gửi lại mã thì mã cũ hết hiệu lực.
 * BE chặn gửi lại trong 60 giây từ mã gần nhất (429 kèm retryAfterSeconds) → nút gửi lại đếm ngược.
 */
function VerifyEmailDialog({ onClose }) {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const verify = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      setUser({ ...user, emailVerifiedAt: data?.emailVerifiedAt ?? new Date().toISOString() });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (err) => setError(err.message),
  });

  const resend = useMutation({
    mutationFn: sendVerificationEmail,
    onSuccess: (data) => {
      setToken("");
      setError("");
      setCooldown(data?.retryAfterSeconds ?? 60);
      toast.success(`Đã gửi mã mới tới ${user.email}`);
    },
    onError: (err) => {
      // 429: chưa đủ 60 giây → chỉ đếm ngược trên nút, không hiện như lỗi
      if (err.retryAfterSeconds) return setCooldown(err.retryAfterSeconds);
      setError(err.message);
    },
  });

  const submit = (e) => {
    e.preventDefault();
    if (!token.trim()) return setError("Ba mẹ dán mã xác thực trong email vào nhé");
    verify.mutate(token.trim());
  };

  if (verify.isSuccess) {
    return (
      <Modal open onClose={onClose} title="Xác thực email" size="max-w-md">
        <div role="status">
          <p className="font-display text-lg font-bold">Email đã được xác thực!</p>
          <p className="mt-1.5 text-[15px] text-navy/65">Cảm ơn ba mẹ, tài khoản đã sẵn sàng.</p>
          <div className="mt-6 flex justify-end">
            <button onClick={onClose} className="btn-primary py-2.5">
              Đóng
            </button>
          </div>
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
          {verify.isPending && <Loader2 size={18} className="animate-spin" />} Xác thực
        </button>
        <button
          type="button"
          onClick={() => resend.mutate()}
          disabled={resend.isPending || cooldown > 0}
          className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-primary-dark hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-60"
        >
          {resend.isPending && <Loader2 size={14} className="animate-spin" />}
          {cooldown > 0 ? `Gửi lại mã sau ${cooldown} giây` : "Không thấy email? Gửi lại mã"}
        </button>
      </form>
    </Modal>
  );
}

export default VerifyEmailDialog;
