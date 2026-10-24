import { cn } from "./cn";

const TONES = {
  neutral: "bg-navy/[0.06] text-navy/70",
  navy: "bg-navy-tint text-navy",
  primary: "bg-primary-tint text-primary-dark",
  secondary: "bg-secondary-tint text-secondary-dark",
  danger: "bg-danger-tint text-danger-dark",
  solidPrimary: "bg-primary text-white",
  solidSecondary: "bg-secondary text-white",
  solidDanger: "bg-danger text-white",
};

const SIZES = {
  sm: "h-5 gap-1 px-2 text-[11px]",
  md: "h-6 gap-1 px-2.5 text-xs",
};

/** Nhãn trạng thái / số đếm dạng viên thuốc. `tone`: khoá trong TONES hoặc chuỗi class màu riêng (vd. REVIEW_TYPES). */
function Badge({ tone = "neutral", size = "md", icon: Icon, className, children, ...rest }) {
  return (
    <span
      className={cn("inline-flex shrink-0 items-center rounded-full font-bold whitespace-nowrap tabular-nums", SIZES[size], TONES[tone] ?? tone, className)}
      {...rest}
    >
      {Icon && <Icon size={size === "sm" ? 11 : 12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}

export default Badge;
