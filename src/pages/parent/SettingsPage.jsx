import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, KeyRound, Loader2, MailWarning, Settings, UserRound } from "lucide-react";
import VerifyEmailDialog from "../../components/auth/VerifyEmailDialog";
import SectionCard from "../../components/parent/children/SectionCard";
import { changePassword, MIN_REGISTER_PASSWORD } from "../../services/authService";
import useAuthStore from "../../stores/authStore";
import { toast } from "../../stores/toastStore";

const inputClass =
  "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-3 outline-none transition focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";

function AccountCard() {
  const user = useAuthStore((s) => s.user);
  const [verifyOpen, setVerifyOpen] = useState(false);

  const rows = [
    ["Họ và tên", user?.fullName || "—"],
    ["Tên đăng nhập", user?.username],
    ["Số điện thoại", user?.phone || "—"],
  ];

  return (
    <SectionCard icon={UserRound} tone="teal" title="Thông tin tài khoản">
      <dl className="space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 rounded-xl bg-surface px-4 py-2.5">
            <dt className="text-navy/60">{label}</dt>
            <dd className="font-semibold">{value}</dd>
          </div>
        ))}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface px-4 py-2.5">
          <dt className="text-navy/60">Email</dt>
          <dd className="flex flex-wrap items-center justify-end gap-2 font-semibold">
            {user?.email}
            {user?.emailVerifiedAt ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary-tint px-2 py-0.5 text-xs font-bold text-secondary-dark">
                <CheckCircle2 size={12} /> Đã xác thực
              </span>
            ) : (
              <button
                onClick={() => setVerifyOpen(true)}
                className="inline-flex items-center gap-1 rounded-full bg-primary-tint px-2 py-0.5 text-xs font-bold text-primary-dark hover:bg-primary hover:text-white"
              >
                <MailWarning size={12} /> Chưa xác thực — nhập mã
              </button>
            )}
          </dd>
        </div>
      </dl>
      {verifyOpen && <VerifyEmailDialog onClose={() => setVerifyOpen(false)} />}
    </SectionCard>
  );
}

const EMPTY = { currentPassword: "", newPassword: "", confirm: "" };

// PUT /auth/change-password
function ChangePasswordCard() {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const save = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setForm(EMPTY);
      toast.success("Đã đổi mật khẩu 🔒");
    },
    onError: (err) => setError(err.message),
  });

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.currentPassword) return setError("Ba mẹ nhập mật khẩu hiện tại nhé");
    if (form.newPassword.length < MIN_REGISTER_PASSWORD) return setError(`Mật khẩu mới có ít nhất ${MIN_REGISTER_PASSWORD} ký tự`);
    if (form.newPassword === form.currentPassword) return setError("Mật khẩu mới cần khác mật khẩu hiện tại");
    if (form.newPassword !== form.confirm) return setError("Mật khẩu nhập lại chưa khớp");
    save.mutate({ currentPassword: form.currentPassword, newPassword: form.newPassword });
  };

  return (
    <SectionCard icon={KeyRound} title="Đổi mật khẩu">
      <form onSubmit={submit} noValidate className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Mật khẩu hiện tại</span>
          <input type="password" autoComplete="current-password" value={form.currentPassword} onChange={set("currentPassword")} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Mật khẩu mới</span>
          <input
            type="password"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={set("newPassword")}
            placeholder={`Ít nhất ${MIN_REGISTER_PASSWORD} ký tự`}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Nhập lại mật khẩu mới</span>
          <input type="password" autoComplete="new-password" value={form.confirm} onChange={set("confirm")} className={inputClass} />
        </label>
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        <div className="flex justify-end">
          <button type="submit" disabled={save.isPending} className="btn-primary py-2.5 text-sm disabled:opacity-60">
            {save.isPending && <Loader2 size={16} className="animate-spin" />} Đổi mật khẩu
          </button>
        </div>
      </form>
    </SectionCard>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
          <Settings size={16} /> Tài khoản
        </p>
        <h1 className="text-3xl">Cài đặt</h1>
        <p className="mt-1 text-navy/70">Thông tin tài khoản và bảo mật. Mã PIN thoát Kid Mode nằm ở mục Bé nhà mình.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AccountCard />
        <ChangePasswordCard />
      </div>
    </div>
  );
}

export default SettingsPage;
