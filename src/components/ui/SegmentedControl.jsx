import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "./cn";

/**
 * Bộ chọn dạng viên thuốc có "con trượt" chạy theo lựa chọn hiện tại.
 * items: [{ value, label, icon? }] • iconOnly: chỉ hiện icon (label dùng cho aria / tooltip)
 * Phím ← → để đổi lựa chọn. Quá rộng thì cuộn ngang thay vì xuống dòng (giữ con trượt thẳng hàng).
 */
function SegmentedControl({ value, onChange, items, label = "Bộ lọc", size = "md", iconOnly = false, className }) {
  const listRef = useRef(null);
  const [thumb, setThumb] = useState(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;
    const measure = () => {
      const el = list.querySelector('[aria-selected="true"]');
      setThumb(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    measure();
    // Font tải xong / khung đổi kích thước làm nút đổi bề rộng
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [value, items]);

  const onKeyDown = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = items.findIndex((t) => t.value === value);
    const next = items[(i + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length];
    onChange(next.value);
    requestAnimationFrame(() => listRef.current?.querySelector('[aria-selected="true"]')?.focus());
  };

  const pad = size === "sm" ? "h-7 px-2.5 text-xs" : "h-8 px-3.5 text-[13px]";

  return (
    <div className={cn("scrollbar-none max-w-full overflow-x-auto rounded-full", className)}>
      <div ref={listRef} role="tablist" aria-label={label} onKeyDown={onKeyDown} className="relative inline-flex rounded-full bg-navy/[0.05] p-1">
        {thumb && (
          <span
            aria-hidden="true"
            className="absolute top-1 bottom-1 left-0 rounded-full bg-white shadow-[0_1px_2px_rgba(30,41,59,0.08),0_2px_8px_-2px_rgba(30,41,59,0.10)] transition-[transform,width] duration-300 ease-(--ease-out-soft)"
            style={{ width: thumb.width, transform: `translateX(${thumb.left}px)` }}
          />
        )}
        {items.map(({ value: v, label: l, icon: Icon }) => {
          const active = v === value;
          return (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={iconOnly ? l : undefined}
              title={iconOnly ? l : undefined}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(v)}
              className={cn(
                "relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full font-bold whitespace-nowrap transition-colors duration-200",
                pad,
                iconOnly && "aspect-square px-0",
                active ? "text-navy" : "text-navy/55 hover:text-navy",
              )}
            >
              {Icon && <Icon size={size === "sm" ? 14 : 15} />}
              {!iconOnly && l}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SegmentedControl;
