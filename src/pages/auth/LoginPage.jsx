import { lazy, Suspense, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, AtSign, Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";
import AuthShell from "../../components/auth/AuthShell";
import ForgotPasswordDialog from "../../components/auth/ForgotPasswordDialog";
import { ROLE_HOME } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";
import { isValidIdentity, login } from "../../services/authService";
import useAuthStore from "../../stores/authStore";
import { toast } from "../../stores/toastStore";

const MIN_PASSWORD = 6;

// Khung tài khoản demo chỉ tồn tại ở bản dev — bản build production loại bỏ hoàn toàn (kể cả mật khẩu mock)
const DemoAccounts = import.meta.env.DEV ? lazy(() => import("../../components/auth/DemoAccounts")) : null;

const inputClass = (invalid) =>
  `w-full rounded-2xl bg-surface py-3 pl-10 text-navy outline-none transition placeholder:text-muted/60 focus:bg-white focus:ring-[3px] ${
    invalid ? "ring-2 ring-danger/50 focus:ring-danger/30" : "focus:ring-secondary/20"
  }`;

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, login: saveSession } = useAuthStore();
  const passwordRef = useRef(null);

  const [form, setForm] = useState({ identity: "", password: "", remember: true });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Sau khi đăng nhập: quay lại trang đang định vào (nếu đúng vai trò), không thì về trang chủ của vai trò
  const redirectAfterLogin = (session) => {
    const from = location.state?.from?.pathname;
    const home = ROLE_HOME[session.user.role];
    const target = from && from.startsWith(`/${home.split("/")[1]}`) ? from : home;
    toast.success(`Chào mừng ${session.user.name} trở lại ✨`);
    navigate(target, { replace: true });
  };

  const onSuccess = (session) => {
    setRedirecting(true);
    saveSession(session, form.remember);
    redirectAfterLogin(session);
  };

  const emailLogin = useMutation({
    mutationFn: ({ identity, password }) => login(identity, password),
    onSuccess,
    onError: (err) => {
      setErrors({ form: err.message });
      setForm((f) => ({ ...f, password: "" }));
      passwordRef.current?.focus();
    },
  });

  // Đã đăng nhập mà vào /login → về thẳng trang của vai trò
  if (isAuthenticated && user && !redirecting) {
    return <Navigate to={ROLE_HOME[user.role] ?? ROUTES.HOME} replace />;
  }

  const set = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((er) => ({ ...er, [key]: undefined, form: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.identity.trim()) next.identity = "Ba mẹ nhập email hoặc số điện thoại nhé";
    else if (!isValidIdentity(form.identity.trim())) next.identity = "Email hoặc số điện thoại chưa đúng định dạng";
    if (!form.password) next.password = "Ba mẹ nhập mật khẩu nhé";
    else if (form.password.length < MIN_PASSWORD) next.password = `Mật khẩu có ít nhất ${MIN_PASSWORD} ký tự`;
    setErrors(next);
    return !Object.keys(next).length;
  };

  const submit = (e) => {
    e.preventDefault();
    if (validate()) emailLogin.mutate({ identity: form.identity.trim(), password: form.password });
  };

  const busy = emailLogin.isPending;

  return (
    <AuthShell
      headerAction={
        <nav className="flex items-center gap-4">
          <span className="hidden text-sm text-navy/60 sm:inline">Bạn chưa có tài khoản?</span>
          <Link to={ROUTES.REGISTER} className="rounded-full bg-surface px-4 py-2 text-sm font-semibold transition hover:bg-outline hover:text-primary-dark">
            Đăng ký ngay
          </Link>
        </nav>
      }
    >
      <div className="mx-auto flex w-full max-w-[440px] flex-col items-center py-8 sm:py-12">
        <div className="relative w-full rounded-[3rem] border border-outline bg-white p-8 shadow-low sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <h1 className="text-2xl sm:text-3xl">Đăng nhập</h1>
            <p className="mt-1.5 text-sm text-navy/60">Chào mừng Ba Mẹ trở lại cùng StoryWeaver</p>
          </div>

          <form onSubmit={submit} noValidate className="flex flex-col gap-4">
            {errors.form && (
              <p role="alert" className="rounded-2xl bg-danger-tint/70 px-4 py-2.5 text-sm font-semibold text-danger-dark">
                {errors.form}
              </p>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="identity" className="text-sm font-semibold">
                Email hoặc Số điện thoại
              </label>
              <div className="relative">
                <AtSign size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
                <input
                  id="identity"
                  autoComplete="username"
                  autoFocus
                  value={form.identity}
                  onChange={set("identity")}
                  placeholder="ba_me@email.com"
                  aria-invalid={!!errors.identity}
                  aria-describedby={errors.identity ? "identity-error" : undefined}
                  className={`${inputClass(errors.identity)} pr-4`}
                />
              </div>
              {errors.identity && (
                <p id="identity-error" className="text-xs font-semibold text-danger">
                  {errors.identity}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
                <input
                  id="password"
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={set("password")}
                  placeholder="••••••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className={`${inputClass(errors.password)} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  aria-pressed={showPassword}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted transition-colors hover:text-navy"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-xs font-semibold text-danger">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1 text-sm">
              <label className="flex cursor-pointer items-center gap-2 select-none">
                <input type="checkbox" checked={form.remember} onChange={set("remember")} className="h-4 w-4 cursor-pointer accent-secondary" />
                <span className="text-navy/70">Ghi nhớ</span>
              </label>
              <button type="button" onClick={() => setForgotOpen(true)} className="font-semibold text-primary-dark hover:underline">
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-display text-lg font-bold text-white shadow-low transition duration-200 hover:bg-primary/90 hover:shadow-mid active:scale-[0.99] disabled:opacity-80"
            >
              {emailLogin.isPending ? (
                <>
                  <Loader2 size={22} className="animate-spin" /> Đang kết nối yêu thương...
                </>
              ) : (
                <>
                  Đăng nhập <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-navy/60">
            Chưa có tài khoản?{" "}
            <Link to={ROUTES.REGISTER} className="font-bold text-primary-dark hover:underline">
              Đăng ký ngay
            </Link>
          </p>

          {/* Chỉ hiện khi chạy dev: điền nhanh tài khoản demo để test các cổng */}
          {DemoAccounts && (
            <Suspense fallback={null}>
              <DemoAccounts
                onPick={(identity, password) => {
                  setForm((f) => ({ ...f, identity, password }));
                  setErrors({});
                }}
              />
            </Suspense>
          )}
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-sm text-muted">
          <ShieldCheck size={16} className="shrink-0 text-secondary" /> Môi trường giáo dục an toàn cho trẻ em • Tuân thủ chuẩn COPPA
        </p>
      </div>

      {forgotOpen && <ForgotPasswordDialog defaultIdentity={form.identity} onClose={() => setForgotOpen(false)} />}
    </AuthShell>
  );
}

export default LoginPage;
