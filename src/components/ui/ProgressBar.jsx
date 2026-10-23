import { cn } from "./cn";

/** Thanh tiến độ 0–100; phần lấp đầy trượt mượt khi giá trị đổi. */
function ProgressBar({ value = 0, label, className }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-2 overflow-hidden rounded-full bg-navy/[0.07]", className)}
    >
      <div
        className="h-full origin-left rounded-full bg-gradient-to-r from-primary-dark to-primary transition-[width] duration-700 ease-(--ease-out-soft)"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

export default ProgressBar;
