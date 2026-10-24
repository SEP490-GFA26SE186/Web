import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "./cn";

// Quy ước hình dạng: mọi phần tử bấm được là viên thuốc (rounded-full); thẻ dùng rounded-card.
const VARIANTS = {
  primary: "bg-primary text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_6px_16px_-6px_rgba(255,122,0,0.55)] hover:bg-[#f27100] hover:shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_22px_-8px_rgba(255,122,0,0.6)]",
  secondary: "border-[1.5px] border-navy/15 bg-white text-navy hover:border-primary/50 hover:bg-primary-tint/40 hover:text-primary-dark",
  ghost: "text-navy/70 hover:bg-navy/[0.05] hover:text-navy",
  tint: "bg-primary-tint text-primary-dark hover:bg-[#ffe8cf]",
  danger: "bg-danger text-white hover:bg-danger-dark",
  dangerGhost: "text-danger hover:bg-danger-tint hover:text-danger-dark",
};

const SIZES = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-6 text-[15px]",
};

const ICON_SIZE = { sm: 14, md: 16, lg: 18 };

/**
 * Nút dùng chung. Truyền `to` để thành Link của router.
 * icon / iconRight: component icon lucide.
 */
function Button({ variant = "primary", size = "md", icon: Icon, iconRight: IconRight, loading = false, to, className, children, disabled, type = "button", ...rest }) {
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center rounded-full font-bold whitespace-nowrap transition duration-200 ease-(--ease-out-soft) select-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
  const iconSize = ICON_SIZE[size];
  const content = (
    <>
      {loading ? <Loader2 size={iconSize} className="animate-spin" /> : Icon && <Icon size={iconSize} strokeWidth={2.25} />}
      {children}
      {IconRight && <IconRight size={iconSize} strokeWidth={2.25} className="transition-transform duration-200 group-hover:translate-x-0.5" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cn("group", classes)} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <button type={type} className={cn("group", classes)} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  );
}

/** Nút chỉ có icon (bắt buộc có label cho trình đọc màn hình). */
export function IconButton({ icon: Icon, label, size = 20, className, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-full text-navy/60 transition duration-200 hover:bg-navy/[0.06] hover:text-navy active:scale-95",
        className,
      )}
      {...rest}
    >
      <Icon size={size} />
    </button>
  );
}

export default Button;
