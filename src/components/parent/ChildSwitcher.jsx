import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Smile } from "lucide-react";
import { useSelectedChild } from "../../hooks/useChildProfile";
import useParentStore from "../../stores/parentStore";
import { ageLabel, childEmoji } from "../../utils/child";

// Chọn bé đang xem (dashboard, tủ sách, báo cáo EQ… đều theo bé này). Nhớ qua lần mở sau (parentStore).
function ChildSwitcher() {
  const { child: current, children, isEmpty } = useSelectedChild();
  const setSelectedChildId = useParentStore((s) => s.setSelectedChildId);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (isEmpty) return null;
  if (!current) return <div className="h-10 w-44 animate-pulse rounded-full bg-secondary-tint" />;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-secondary-tint py-1.5 pr-3 pl-2 text-left transition hover:ring-2 hover:ring-secondary/30"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-secondary">
          <Smile size={16} />
        </span>
        <span className="leading-tight">
          <span className="block text-xs font-bold">
            {current.name} ({ageLabel(current)})
          </span>
          <span className="block text-[11px] text-navy/70">📚 {current.booksCount} truyện trong tủ</span>
        </span>
        <ChevronDown size={16} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-60 rounded-2xl border border-outline bg-white p-2 shadow-high">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => {
                setSelectedChildId(child.id);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-surface"
            >
              <span className="text-xl">{childEmoji(child)}</span>
              <span className="flex-1 text-sm">
                <span className="block font-bold">{child.name}</span>
                <span className="text-xs text-navy/60">
                  {ageLabel(child)} · 📚 {child.booksCount}
                </span>
              </span>
              {child.id === current.id && <Check size={16} className="text-secondary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChildSwitcher;
