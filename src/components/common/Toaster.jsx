import { useEffect, useRef } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import useToastStore, { TOAST_DURATION } from "../../stores/toastStore";
import { cn } from "../ui";

// Màu theo token thương hiệu: thành công = xanh ngọc, lỗi = đỏ, thông tin = cam chủ đạo
const STYLES = {
  success: { icon: CheckCircle2, chip: "bg-secondary-tint text-secondary-dark", bar: "bg-secondary" },
  error: { icon: XCircle, chip: "bg-danger-tint text-danger", bar: "bg-danger" },
  info: { icon: Info, chip: "bg-primary-tint text-primary-dark", bar: "bg-primary" },
};

function ToastItem({ id, message, type, leaving }) {
  const { dismiss, pause, resume } = useToastStore();
  const { icon: Icon, chip, bar } = STYLES[type] ?? STYLES.info;
  const barRef = useRef(null);
  const startedAt = useRef(0);
  const elapsed = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const onEnter = () => {
    elapsed.current += Date.now() - startedAt.current;
    pause(id);
    if (barRef.current) barRef.current.style.animationPlayState = "paused";
  };
  const onLeave = () => {
    startedAt.current = Date.now();
    resume(id, TOAST_DURATION - elapsed.current);
    if (barRef.current) barRef.current.style.animationPlayState = "running";
  };

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn(
        "pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-2xl bg-white py-3 pr-3 pl-3 text-sm shadow-[0_0_0_1px_rgba(30,41,59,0.06),var(--shadow-high)]",
        leaving ? "animate-toast-out" : "animate-toast-in",
      )}
    >
      <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-xl", chip)}>
        <Icon size={18} />
      </span>
      <p className="min-w-0 flex-1 self-center leading-snug font-semibold text-navy">{message}</p>
      <button
        type="button"
        onClick={() => dismiss(id)}
        aria-label="Đóng thông báo"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-navy/40 transition hover:bg-navy/[0.06] hover:text-navy"
      >
        <X size={15} />
      </button>
      {/* Thanh đếm ngược thời gian còn hiển thị */}
      <span
        ref={barRef}
        aria-hidden="true"
        className={cn("absolute bottom-0 left-0 h-[3px] w-full origin-left animate-toast-timer opacity-70", bar)}
        style={{ animationDuration: `${TOAST_DURATION}ms` }}
      />
    </div>
  );
}

function Toaster() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[70] flex w-[min(400px,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  );
}

export default Toaster;
