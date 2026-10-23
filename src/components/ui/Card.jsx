import { Link } from "react-router-dom";
import { cn } from "./cn";

const PADDING = { none: "", sm: "p-4", md: "p-5 md:p-6", lg: "p-6 md:p-8" };

/**
 * Bề mặt nổi của dashboard: nền trắng, viền trong 1px, bo rounded-card.
 * interactive: nhấc nhẹ khi hover • to: biến cả thẻ thành Link • reveal: hiện lần lượt khi vào trang (kèm index).
 */
function Card({ as: Tag = "section", to, interactive = false, padding = "md", reveal = false, index = 0, className, style, children, ...rest }) {
  const classes = cn(
    "relative rounded-card bg-white shadow-ring",
    PADDING[padding],
    (interactive || to) &&
      "transition duration-300 ease-(--ease-out-soft) hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(30,41,59,0.06),var(--shadow-mid)] active:translate-y-0",
    reveal && "animate-rise stagger",
    className,
  );
  const s = reveal ? { "--i": index, ...style } : style;

  if (to) {
    return (
      <Link to={to} className={cn("block", classes)} style={s} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <Tag className={classes} style={s} {...rest}>
      {children}
    </Tag>
  );
}

/** Đầu thẻ: tiêu đề + mô tả ngắn bên dưới, hành động (link / nút) bên phải. */
export function CardHeader({ title, description, icon: Icon, action, className }) {
  return (
    <div className={cn("flex items-start justify-between gap-3", className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-tint text-primary-dark">
            <Icon size={18} />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="text-lg leading-snug">{title}</h2>
          {description && <p className="mt-0.5 max-w-[65ch] text-sm text-navy/60">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default Card;
