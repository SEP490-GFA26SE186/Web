import { Check } from "lucide-react";
import { cn } from "./cn";

/**
 * Thẻ lựa chọn bấm được (thay cho <button> trơn trông như khối chữ).
 * - Luôn có ô chọn ở góc: tròn (chọn một, `multiple=false`) hoặc vuông (chọn nhiều) → nhìn là biết bấm được.
 * - Viền rõ, nhấc nhẹ khi hover; đã chọn → viền cam + nền cam nhạt + dấu tick.
 * leading: icon / ảnh bên trái • title • description • footer: dòng phụ dưới cùng (giá, ghi chú)
 * compact: thẻ nhỏ (vd. chọn độ dài) • indicator=false: bỏ ô chọn (thẻ hành động, vd. "Thêm nhân vật")
 */
function ChoiceCard({
  selected = false,
  multiple = false,
  onClick,
  disabled = false,
  leading,
  title,
  description,
  footer,
  children,
  compact = false,
  indicator = true,
  className,
  ...rest
}) {
  return (
    <button
      type="button"
      role={indicator ? (multiple ? "checkbox" : "radio") : undefined}
      aria-checked={indicator ? selected : undefined}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative flex w-full cursor-pointer flex-col items-start gap-1.5 rounded-2xl border-[1.5px] bg-white text-left transition duration-200 ease-(--ease-out-soft)",
        compact ? "p-3.5" : "p-4",
        selected
          ? "border-primary bg-primary-tint/50 shadow-[0_0_0_3px_rgba(255,122,0,0.12)]"
          : "border-navy/12 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-mid",
        "active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-navy/12 disabled:hover:shadow-none",
        className,
      )}
      {...rest}
    >
      {indicator && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-3.5 right-3.5 grid h-5 w-5 place-items-center border-[1.5px] transition duration-200",
            multiple ? "rounded-md" : "rounded-full",
            selected ? "border-primary bg-primary text-white" : "border-navy/25 bg-white group-hover:border-primary/60",
          )}
        >
          {selected && <Check size={13} strokeWidth={3} />}
        </span>
      )}
      {leading && <span className="mb-1">{leading}</span>}
      {title && <span className={cn("pr-7 font-display font-bold text-navy", compact ? "text-[15px]" : "text-base")}>{title}</span>}
      {description && <span className="pr-2 text-sm leading-relaxed text-navy/60">{description}</span>}
      {children}
      {footer && <span className="mt-auto pt-1.5 text-xs font-semibold">{footer}</span>}
    </button>
  );
}

export default ChoiceCard;
