import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "./cn";

/**
 * Hàng điều hướng trong danh sách: icon, nội dung, phần phụ bên phải, mũi tên trượt khi hover.
 * Dùng trong thẻ đã có padding — tự kéo lề âm để vùng hover tràn sát mép.
 */
function ListRow({ to, icon: Icon, iconTone = "bg-primary-tint text-primary-dark", title, meta, trailing, children, className }) {
  return (
    <Link
      to={to}
      className={cn(
        "group -mx-3 flex items-center gap-3 rounded-2xl px-3 py-3 transition duration-200 ease-(--ease-out-soft) hover:bg-surface active:scale-[0.995]",
        className,
      )}
    >
      {Icon && (
        <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", iconTone)}>
          <Icon size={17} />
        </span>
      )}
      <div className="min-w-0 flex-1">
        {title && <p className="truncate text-sm font-bold text-navy">{title}</p>}
        {meta && <p className="truncate text-[13px] text-navy/55">{meta}</p>}
        {children}
      </div>
      {trailing}
      <ChevronRight size={16} className="shrink-0 text-navy/25 transition duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}

export default ListRow;
