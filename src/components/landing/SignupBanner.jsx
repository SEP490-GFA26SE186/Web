import { forwardRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Sparkles, WandSparkles, Zap } from "lucide-react";
import { SIGNUP_BONUS_CREDITS } from "../../constants/landingContent";
import { EMAIL_REGEX, requestSignup } from "../../services/authService";

// Banner CTA cuối trang: nhập email phụ huynh để nhận link tạo tài khoản
const SignupBanner = forwardRef(function SignupBanner(_, inputRef) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const signup = useMutation({ mutationFn: requestSignup });

  const submit = (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_REGEX.test(value)) {
      setError("Ba mẹ kiểm tra lại email giúp nhé (ví dụ: me.bo@gmail.com)");
      inputRef.current?.focus();
      return;
    }
    setError("");
    signup.mutate(value, { onError: (err) => setError(err.message) });
  };

  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pb-16 md:px-8">
      <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-primary via-primary-dark to-[#5c2800] p-8 text-white shadow-high sm:p-10">
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <WandSparkles size={64} className="pointer-events-none absolute top-6 left-12 opacity-20" aria-hidden="true" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="flex max-w-xl flex-col gap-2 text-center lg:text-left">
            <span className="mx-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-4 py-1 text-xs font-bold backdrop-blur-md lg:mx-0">
              <Sparkles size={16} className="fill-yellow-300 text-yellow-300" /> Tặng ngay {SIGNUP_BONUS_CREDITS} AI Credits trải nghiệm khi đăng ký
            </span>
            <h2 className="text-3xl leading-tight sm:text-4xl">Bắt đầu hành trình nuôi dưỡng cảm xúc cho con ngay hôm nay</h2>
            <p className="text-lg text-white/90">Đăng ký tài khoản miễn phí chỉ trong 30 giây. Không cần thẻ tín dụng, hoàn toàn an toàn cho trẻ.</p>
          </div>

          {signup.isSuccess ? (
            <div role="status" className="flex w-full max-w-md items-start gap-3 rounded-card bg-white/95 p-5 text-navy shadow-high lg:w-auto">
              <CheckCircle2 size={26} className="shrink-0 text-secondary" />
              <div>
                <p className="font-display text-lg font-bold">Đã gửi link tạo tài khoản!</p>
                <p className="text-sm text-navy/70">
                  Ba mẹ kiểm tra hộp thư <b>{signup.data.email}</b> để kích hoạt và nhận {SIGNUP_BONUS_CREDITS} AI Credits nhé.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex w-full flex-col gap-2 lg:w-auto">
              <div className="flex w-full flex-col items-center gap-3 sm:flex-row">
                <label className="w-full sm:w-80">
                  <span className="sr-only">Email của ba mẹ</span>
                  <input
                    id="signup-email"
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    aria-invalid={!!error}
                    aria-describedby={error ? "signup-error" : undefined}
                    placeholder="Nhập email của ba mẹ..."
                    className="h-14 w-full rounded-full bg-white px-5 text-navy shadow-mid outline-none placeholder:text-navy/40 focus:ring-4 focus:ring-teal-200/60"
                  />
                </label>
                <button
                  type="submit"
                  disabled={signup.isPending}
                  className="flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-teal-200 px-8 font-display text-lg font-bold text-[#00201c] shadow-mid transition hover:bg-teal-100 disabled:opacity-70 sm:w-auto"
                >
                  {signup.isPending ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} className="fill-current" />}
                  Tạo câu chuyện đầu tiên
                </button>
              </div>
              {error && (
                <p id="signup-error" className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-semibold text-danger">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
});

export default SignupBanner;
