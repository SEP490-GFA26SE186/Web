import { useEffect, useRef, useState } from "react";
import { BookOpen, Check, ChevronDown } from "lucide-react";
import { useSelectedChild } from "../../hooks/useChildProfile";
import useParentStore from "../../stores/parentStore";
import { ageLabel, childEmoji } from "../../utils/child";
import { Skeleton, cn } from "../ui";

// Chọn bé đang xem (dashboard, tủ sách, báo cáo EQ… đều theo bé này). Nhớ qua lần mở sau (parentStore).
function ChildSwitcher() {
  const { child: current, children, isEmpty } = useSelectedChild();
  const setSelectedChildId = useParentStore((s) => s.setSelectedChildId);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (isEmpty) return null;
  if (!current) return <Skeleton className="h-10 w-44 rounded-full" />;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "flex h-10 items-center gap-2 rounded-full bg-white py-1 pr-3 pl-1 text-left shadow-ring transition duration-200 hover:bg-surface active:scale-[0.98]",
          open && "bg-surface",
        )}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary-tint text-base">{childEmoji(current)}</span>
        <span className="leading-tight">
          <span className="block text-xs font-bold">{current.name}</span>
          <span className="block text-[11px] text-navy/55">{ageLabel(current)}</span>
        </span>
        <ChevronDown size={15} className={cn("text-navy/45 transition-transform duration-300 ease-(--ease-out-soft)", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Chọn bé"
          className="absolute right-0 z-30 mt-2 w-64 origin-top-right animate-pop-in rounded-2xl bg-white p-1.5 shadow-[0_0_0_1px_rgba(30,41,59,0.06),var(--shadow-high)]"
        >
          {children.map((child) => {
            const selected = child.id === current.id;
            return (
              <button
                key={child.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setSelectedChildId(child.id);
                  setOpen(false);
                }}
                className={cn("flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors duration-150", selected ? "bg-secondary-tint/60" : "hover:bg-surface")}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary-tint text-lg">{childEmoji(child)}</span>
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block truncate font-bold">{child.name}</span>
                  <span className="flex items-center gap-1 text-xs text-navy/55">
                    {ageLabel(child)}
                    <span aria-hidden="true">·</span>
                    <BookOpen size={12} /> {child.booksCount} truyện
                  </span>
                </span>
                {selected && <Check size={16} className="shrink-0 text-secondary-dark" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ChildSwitcher;
