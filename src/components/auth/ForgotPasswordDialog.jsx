import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import Modal from "../common/Modal";
import { requestPasswordReset } from "../../services/authService";

function ForgotPasswordDialog({ defaultIdentity = "", onClose }) {
  const [identity, setIdentity] = useState(defaultIdentity);
  const reset = useMutation({ mutationFn: requestPasswordReset });

  const submit = (e) => {
    e.preventDefault();
    if (identity.trim()) reset.mutate(identity.trim());
  };

  return (
    <Modal open onClose={onClose} title="Quên mật khẩu?" description="Nhập email hoặc số điện thoại đã đăng ký, StoryWeaver sẽ gửi hướng dẫn đặt lại mật khẩu." size="max-w-md">
      {reset.isSuccess ? (
        <div role="status" className="flex flex-col items-center gap-2 py-4 text-center">
          <CheckCircle2 size={44} className="text-secondary" />
          <p className="font-display text-lg font-bold">Đã gửi hướng dẫn!</p>
          <p className="text-sm text-navy/70">
            Ba mẹ kiểm tra <b>{identity}</b> và làm theo hướng dẫn trong vòng 15 phút nhé.
          </p>
          <button onClick={onClose} className="btn-primary mt-3 py-2.5">
            Quay lại đăng nhập
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold">Email hoặc Số điện thoại</span>
            <input
              autoFocus
              value={identity}
              onChange={(e) => {
                setIdentity(e.target.value);
                reset.reset();
              }}
              placeholder="ba_me@email.com"
              className="w-full rounded-2xl bg-surface px-4 py-3 outline-none placeholder:text-muted/60 focus:bg-white focus:ring-[3px] focus:ring-secondary/20"
            />
          </label>
          {reset.isError && <p className="text-sm font-semibold text-danger">{reset.error.message}</p>}
          <button type="submit" disabled={!identity.trim() || reset.isPending} className="btn-primary mt-1 w-full py-3 disabled:opacity-60">
            {reset.isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} Gửi hướng dẫn
          </button>
        </form>
      )}
    </Modal>
  );
}

export default ForgotPasswordDialog;
