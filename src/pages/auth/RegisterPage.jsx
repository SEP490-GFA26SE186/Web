import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, AtSign, Eye, EyeOff, Loader2, Lock, Mail, Phone, ShieldCheck, UserRound } from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import { ROLE_HOME } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { EMAIL_REGEX, MIN_REGISTER_PASSWORD, USERNAME_REGEX, register } from "../../services/authService";
import useAuthStore from "../../stores/authStore";
import { toast } from "../../stores/toastStore";

const inputClass = (invalid) =>
  `w-full rounded-2xl bg-surface py-3 pr-4 pl-10 text-navy outline-none transition placeholder:text-muted/60 focus:bg-white focus:ring-[3px] ${
    invalid ? "ring-2 ring-danger/50 focus:ring-danger/30" : "focus:ring-secondary/20"
  }`;

function Field({ id, label, icon: Icon, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        <Icon size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
        {children}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-xs font-semibold text-danger">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-navy/50">{hint}</p>
      )}
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, login: saveSession } = useAuthStore();

  const [form, setForm] = useState({ fullName: "", username: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const signup = useMutation({
    mutationFn: register,
    onSuccess: (session) => {
      setRedirecting(true);
      saveSession(session, true);
      toast.success(`Chào mừng ${session.user.fullName || session.user.username}! Ba mẹ kiểm tra email để xác thực tài khoản nhé ✨`);
      navigate(ROLE_HOME[session.user.role] ?? ROUTES.HOME, { replace: true });
    },
    onError: (err) => setErrors({ form: err.message }),
  });

  if (isAuthenticated && user && !redirecting) {
    return <Navigate to={ROLE_HOME[user.role] ?? ROUTES.HOME} replace />;
  }

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined, form: undefined }));
  };

  // Khớp auth.validation.js của BE
  const validate = () => {
    const next = {};
    const username = form.username.trim();
    if (!username) next.username = "Ba mẹ nhập tên đăng nhập nhé";
    else if (!USERNAME_REGEX.test(username)) next.username = "Từ 3–50 ký tự, chỉ gồm chữ không dấu, số và dấu _";
    if (!form.email.trim()) next.email = "Ba mẹ nhập email nhé";
    else if (!EMAIL_REGEX.test(form.email.trim())) next.email = "Email chưa đúng định dạng";
    if (form.fullName.trim().length > 150) next.fullName = "Họ tên tối đa 150 ký tự";
    if (form.phone.trim().length > 20) next.phone = "Số điện thoại tối đa 20 ký tự";
    if (form.password.length < MIN_REGISTER_PASSWORD) next.password = `Mật khẩu có ít nhất ${MIN_REGISTER_PASSWORD} ký tự`;
    if (form.confirmPassword !== form.password) next.confirmPassword = "Mật khẩu nhập lại chưa khớp";
    setErrors(next);
    return !Object.keys(next).length;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    signup.mutate({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
    });
  };

  const aria = (key) => ({ "aria-invalid": !!errors[key], "aria-describedby": errors[key] ? `${key}-error` : undefined });

  return (
    <AuthShell
      headerAction={
        <nav className="flex items-center gap-4">
          <span className="hidden text-sm text-navy/60 sm:inline">Đã có tài khoản?</span>
          <Link to={ROUTES.LOGIN} className="rounded-full bg-surface px-4 py-2 text-sm font-semibold transition hover:bg-outline hover:text-primary-dark">
            Đăng nhập
          </Link>
        </nav>
      }
    >
      <div className="mx-auto flex w-full max-w-[480px] flex-col items-center py-8 sm:py-12">
        <div className="relative w-full rounded-[3rem] border border-outline bg-white p-8 shadow-low sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <h1 className="text-2xl sm:text-3xl">Đăng ký</h1>
            <p className="mt-1.5 text-sm text-navy/60">Tạo tài khoản phụ huynh để cùng bé khám phá StoryWeaver</p>
          </div>

          <form onSubmit={submit} noValidate className="flex flex-col gap-4">
            {errors.form && (
              <p role="alert" className="rounded-2xl bg-danger-tint/70 px-4 py-2.5 text-sm font-semibold text-danger-dark">
                {errors.form}
              </p>
            )}

            <Field id="fullName" label="Họ và tên" icon={UserRound} error={errors.fullName}>
              <input id="fullName" autoComplete="name" autoFocus value={form.fullName} onChange={set("fullName")} placeholder="Nguyễn Lan Hương" maxLength={150} {...aria("fullName")} className={inputClass(errors.fullName)} />
            </Field>

            <Field id="username" label="Tên đăng nhập *" icon={AtSign} error={errors.username} hint="Chữ không dấu, số và dấu _">
              <input id="username" autoComplete="username" value={form.username} onChange={set("username")} placeholder="me_lanhuong" maxLength={50} {...aria("username")} className={inputClass(errors.username)} />
            </Field>

            <Field id="email" label="Email *" icon={Mail} error={errors.email}>
              <input id="email" type="email" autoComplete="email" value={form.email} onChange={set("email")} placeholder="ba_me@email.com" {...aria("email")} className={inputClass(errors.email)} />
            </Field>

            <Field id="phone" label="Số điện thoại" icon={Phone} error={errors.phone}>
              <input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} placeholder="0901234567" maxLength={20} {...aria("phone")} className={inputClass(errors.phone)} />
            </Field>

            <Field id="password" label="Mật khẩu *" icon={Lock} error={errors.password} hint={`Ít nhất ${MIN_REGISTER_PASSWORD} ký tự`}>
              <input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={set("password")} placeholder="••••••••" {...aria("password")} className={`${inputClass(errors.password)} pr-11`} />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                aria-pressed={showPassword}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted transition-colors hover:text-navy"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </Field>

            <Field id="confirmPassword" label="Nhập lại mật khẩu *" icon={Lock} error={errors.confirmPassword}>
              <input id="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="••••••••" {...aria("confirmPassword")} className={inputClass(errors.confirmPassword)} />
            </Field>

            <button
              type="submit"
              disabled={signup.isPending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-display text-lg font-bold text-white shadow-low transition duration-200 hover:bg-primary/90 hover:shadow-mid active:scale-[0.99] disabled:opacity-80"
            >
              {signup.isPending ? (
                <>
                  <Loader2 size={22} className="animate-spin" /> Đang tạo tài khoản...
                </>
              ) : (
                <>
                  Tạo tài khoản <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-navy/60">
            Đã có tài khoản?{" "}
            <Link to={ROUTES.LOGIN} className="font-bold text-primary-dark hover:underline">
              Đăng nhập
            </Link>
          </p>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-sm text-muted">
          <ShieldCheck size={16} className="shrink-0 text-secondary" /> Môi trường giáo dục an toàn cho trẻ em • Tuân thủ chuẩn COPPA
        </p>
      </div>
    </AuthShell>
  );
}

export default RegisterPage;
