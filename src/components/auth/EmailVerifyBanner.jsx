import { useState } from "react";
import { MailWarning } from "lucide-react";
import useAuthStore from "../../stores/authStore";
import VerifyEmailDialog from "./VerifyEmailDialog";

// Nhắc xác thực email khi user.emailVerifiedAt còn trống (lấy từ đăng nhập / GET /auth/me)
function EmailVerifyBanner() {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);

  if (!user || user.emailVerifiedAt) return null;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary-tint/60 px-4 py-3 text-sm">
        <span className="flex items-center gap-2">
          <MailWarning size={18} className="shrink-0 text-primary-dark" />
          <span>
            Email <b>{user.email}</b> chưa được xác thực. Ba mẹ nhập mã đã gửi qua email để hoàn tất nhé.
          </span>
        </span>
        <button onClick={() => setOpen(true)} className="rounded-full bg-primary px-4 py-1.5 font-bold text-white shadow-low transition hover:bg-primary-dark">
          Nhập mã xác thực
        </button>
      </div>
      {open && <VerifyEmailDialog onClose={() => setOpen(false)} />}
    </>
  );
}

export default EmailVerifyBanner;
