import { cn } from "./cn";

const TONES = {
  neutral: "bg-surface text-navy/50",
  secondary: "bg-secondary-tint text-secondary",
  primary: "bg-primary-tint text-primary",
  danger: "bg-danger-tint text-danger",
};

/** Trạng thái trống / lỗi: icon, tiêu đề, mô tả cách lấp đầy, hành động tuỳ chọn. */
function EmptyState({ icon: Icon, title, description, action, tone = "neutral", compact = false, className }) {
  return (
    <div className={cn("flex flex-col items-center text-center", compact ? "gap-2 px-4 py-6" : "gap-3 px-6 py-10", className)}>
      {Icon && (
        <span className={cn("grid place-items-center rounded-2xl", compact ? "h-11 w-11" : "h-14 w-14", TONES[tone])}>
          <Icon size={compact ? 22 : 26} />
        </span>
      )}
      <div className="space-y-1">
        <p className="font-display font-bold text-navy">{title}</p>
        {description && <p className="mx-auto max-w-[42ch] text-sm text-navy/60">{description}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

export default EmptyState;
