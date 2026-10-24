import { cn } from "./cn";

/** Đầu trang: tiêu đề + mô tả xếp dọc bên trái, công cụ (lọc, xuất file) bên phải. */
function PageHeader({ title, description, children, className }) {
  return (
    <div className={cn("flex animate-rise flex-col justify-between gap-4 md:flex-row md:items-end", className)}>
      <div className="min-w-0">
        <h1 className="text-2xl leading-tight tracking-tight md:text-[30px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-[70ch] text-[15px] text-navy/60">{description}</p>}
      </div>
      {children && <div className="flex min-w-0 flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export default PageHeader;
