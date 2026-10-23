import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "./cn";

// Danh sách dài hơn mức này thì có ô tìm kiếm
const SEARCH_THRESHOLD = 8;
const MENU_MAX_H = 288;
const GAP = 6;

const SHAPES = {
  pill: "rounded-full",
  field: "rounded-2xl",
};
const SIZES = {
  sm: "h-9 pl-3.5 pr-2.5 text-[13px]",
  md: "h-11 pl-4 pr-3 text-sm",
  lg: "h-12 pl-4 pr-3.5 text-[15px]",
};

const normalize = (s) =>
  String(s)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

/**
 * Ô chọn tự dựng thay cho <select> gốc.
 * options: [{ value, label, description?, icon?, disabled? }] — value giữ nguyên kiểu (số / chuỗi), onChange(value) trả lại đúng giá trị đó.
 * placeholder: chữ khi chưa chọn (value rỗng / không khớp) • label: nhãn cho trình đọc màn hình khi không có <label> bao ngoài
 * renderValue(option): tuỳ biến chữ hiển thị trên nút • searchable: mặc định bật khi > 8 lựa chọn
 * width: class bề rộng (mặc định w-full) • required + name: có input ẩn để form gốc vẫn chặn submit khi chưa chọn.
 * Popover render qua portal (position: fixed) nên không bị modal / overflow-hidden cắt; tự lật lên khi thiếu chỗ phía dưới.
 */
function Select({
  value,
  onChange,
  options,
  placeholder = "Chọn…",
  label,
  id,
  name,
  required = false,
  disabled = false,
  size = "md",
  shape = "field",
  searchable,
  renderValue,
  highlight = false,
  icon: TriggerIcon = ChevronDown,
  width = "w-full",
  className,
  menuClassName,
}) {
  const autoId = useId();
  const listId = `${autoId}-list`;
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const typeahead = useRef({ text: "", at: 0 });

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [pos, setPos] = useState(null);

  const canSearch = searchable ?? options.length > SEARCH_THRESHOLD;
  const selectedIndex = options.findIndex((o) => String(o.value) === String(value));
  const selected = options[selectedIndex];

  const filtered = useMemo(() => {
    if (!canSearch || !query.trim()) return options;
    const q = normalize(query.trim());
    return options.filter((o) => normalize(o.label).includes(q));
  }, [options, query, canSearch]);

  const close = useCallback((refocus = true) => {
    setOpen(false);
    setQuery("");
    if (refocus) triggerRef.current?.focus();
  }, []);

  const openMenu = () => {
    if (disabled) return;
    setOpen(true);
    setActiveIndex(Math.max(0, selectedIndex));
  };

  const choose = (option) => {
    if (!option || option.disabled) return;
    onChange?.(option.value);
    close();
  };

  // Định vị popover theo nút; lật lên trên nếu phía dưới thiếu chỗ
  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const below = window.innerHeight - r.bottom - GAP;
    const above = r.top - GAP;
    const up = below < Math.min(MENU_MAX_H, 200) && above > below;
    setPos({
      left: r.left,
      width: r.width,
      top: up ? undefined : r.bottom + GAP,
      bottom: up ? window.innerHeight - r.top + GAP : undefined,
      maxHeight: Math.max(160, Math.min(MENU_MAX_H, (up ? above : below) - 8)),
      up,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return undefined;
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true); // capture: cuộn trong modal / vùng con cũng cập nhật
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  // Bấm ra ngoài thì đóng
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (triggerRef.current?.contains(e.target) || menuRef.current?.contains(e.target)) return;
      close(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, close]);

  // Mở ra: focus ô tìm kiếm (nếu có) hoặc danh sách
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => (canSearch ? searchRef.current : menuRef.current?.querySelector('[role="listbox"]'))?.focus());
  }, [open, canSearch]);

  // Giữ mục đang trỏ trong vùng nhìn thấy
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    menuRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const move = (step) => {
    if (!filtered.length) return;
    let i = activeIndex;
    for (let n = 0; n < filtered.length; n += 1) {
      i = (i + step + filtered.length) % filtered.length;
      if (!filtered[i].disabled) break;
    }
    setActiveIndex(i);
  };

  const onTriggerKeyDown = (e) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openMenu();
    }
  };

  const onMenuKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-1);
        break;
      case "Home":
        if (canSearch) break;
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        if (canSearch) break;
        e.preventDefault();
        setActiveIndex(filtered.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        choose(filtered[activeIndex]);
        break;
      case "Escape":
        e.preventDefault();
        e.stopPropagation(); // không đóng luôn modal bao ngoài
        close();
        break;
      case "Tab":
        close(false);
        break;
      default:
        // Gõ chữ để nhảy tới lựa chọn (khi không có ô tìm kiếm)
        if (!canSearch && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          const now = Date.now();
          const t = typeahead.current;
          t.text = now - t.at > 600 ? e.key : t.text + e.key;
          t.at = now;
          const i = filtered.findIndex((o) => !o.disabled && normalize(o.label).startsWith(normalize(t.text)));
          if (i >= 0) setActiveIndex(i);
        }
    }
  };

  const display = selected ? (renderValue ? renderValue(selected) : selected.label) : placeholder;
  const SelectedIcon = selected?.icon;

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={label}
        disabled={disabled}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "group relative inline-flex min-w-0 cursor-pointer items-center gap-2 border-[1.5px] bg-white text-left font-semibold transition duration-200 ease-(--ease-out-soft) outline-none",
          "hover:border-navy/20 focus-visible:border-secondary focus-visible:ring-[3px] focus-visible:ring-secondary/15",
          "disabled:cursor-not-allowed disabled:bg-surface disabled:text-navy/50 disabled:hover:border-outline",
          SHAPES[shape],
          SIZES[size],
          width,
          open ? "border-secondary ring-[3px] ring-secondary/15" : "border-outline",
          className,
        )}
      >
        {SelectedIcon && <SelectedIcon size={16} className="shrink-0 text-navy/60" />}
        <span className={cn("min-w-0 flex-1 truncate", !selected && "font-normal text-navy/45", highlight && selected && "text-primary-dark")}>{display}</span>
        <TriggerIcon
          size={16}
          className={cn(
            "shrink-0 transition-transform duration-300 ease-(--ease-out-soft)",
            highlight ? "text-primary-dark" : "text-navy/45",
            open && TriggerIcon === ChevronDown && "rotate-180",
          )}
        />
      </button>

      {required && (
        <input
          tabIndex={-1}
          aria-hidden="true"
          name={name}
          required
          value={selected ? String(selected.value) : ""}
          onChange={() => {}}
          onFocus={() => triggerRef.current?.focus()}
          className="pointer-events-none absolute h-px w-px opacity-0"
        />
      )}

      {open &&
        pos &&
        createPortal(
          <div
            ref={menuRef}
            onKeyDown={onMenuKeyDown}
            style={{ left: pos.left, top: pos.top, bottom: pos.bottom, minWidth: pos.width }}
            className={cn(
              "fixed z-[60] flex max-w-[min(28rem,calc(100vw-1rem))] animate-pop-in flex-col overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(30,41,59,0.07),var(--shadow-high)]",
              pos.up ? "origin-bottom" : "origin-top",
              menuClassName,
            )}
          >
            {canSearch && (
              <div className="flex items-center gap-2 border-b border-navy/[0.06] px-3">
                <Search size={15} className="shrink-0 text-navy/40" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  placeholder="Tìm…"
                  aria-label="Tìm lựa chọn"
                  aria-controls={listId}
                  aria-activedescendant={activeIndex >= 0 ? `${autoId}-opt-${activeIndex}` : undefined}
                  className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-navy/40"
                />
              </div>
            )}
            <ul
              id={listId}
              role="listbox"
              tabIndex={-1}
              aria-label={label}
              aria-activedescendant={activeIndex >= 0 ? `${autoId}-opt-${activeIndex}` : undefined}
              style={{ maxHeight: pos.maxHeight - (canSearch ? 41 : 0) }}
              className="overflow-y-auto overscroll-contain p-1.5 outline-none"
            >
              {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-navy/50">Không có lựa chọn phù hợp</li>}
              {filtered.map((o, i) => {
                const isSelected = String(o.value) === String(value);
                const OptIcon = o.icon;
                return (
                  <li
                    key={String(o.value)}
                    id={`${autoId}-opt-${i}`}
                    data-index={i}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={o.disabled || undefined}
                    onMouseEnter={() => !o.disabled && setActiveIndex(i)}
                    onMouseDown={(e) => e.preventDefault()} // giữ focus trong popover
                    onClick={() => choose(o)}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors duration-100",
                      i === activeIndex && !o.disabled && "bg-surface",
                      isSelected ? "font-bold text-navy" : "text-navy/80",
                      o.disabled && "cursor-not-allowed opacity-45",
                    )}
                  >
                    {OptIcon && <OptIcon size={16} className="shrink-0 text-navy/50" />}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{o.label}</span>
                      {o.description && <span className="block truncate text-xs font-normal text-navy/50">{o.description}</span>}
                    </span>
                    <Check size={15} strokeWidth={2.5} className={cn("shrink-0 text-secondary-dark transition-opacity", isSelected ? "opacity-100" : "opacity-0")} />
                  </li>
                );
              })}
            </ul>
          </div>,
          document.body,
        )}
    </>
  );
}

export default Select;
