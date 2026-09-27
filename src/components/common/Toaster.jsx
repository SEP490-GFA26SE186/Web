import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import useToastStore from "../../stores/toastStore";

const styles = {
  success: { icon: CheckCircle2, className: "text-teal-300" },
  error: { icon: XCircle, className: "text-red-300" },
  info: { icon: Info, className: "text-amber-300" },
};

function Toaster() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-[min(420px,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
      {toasts.map(({ id, message, type }) => {
        const { icon: Icon, className } = styles[type];
        return (
          <div
            key={id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-2xl bg-navy px-4 py-3 text-sm text-white shadow-high"
          >
            <Icon size={19} className={`mt-0.5 shrink-0 ${className}`} />
            <span className="flex-1 font-semibold">{message}</span>
            <button onClick={() => dismiss(id)} aria-label="Đóng" className="rounded-full p-0.5 text-white/60 hover:text-white">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Toaster;
