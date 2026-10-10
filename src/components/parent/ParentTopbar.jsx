import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Coins, Menu, Search, Smile } from "lucide-react";
import { Link } from "react-router-dom";
import InitialAvatar from "../common/InitialAvatar";
import { ROUTES } from "../../constants/routes";
import { useSelectedChild } from "../../hooks/useChildProfile";
import { useParentProfile } from "../../hooks/useParent";
import useParentStore from "../../stores/parentStore";
import { ageLabel, childEmoji } from "../../utils/child";

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

function ParentTopbar({ onOpenMenu }) {
  const parent = useParentProfile();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-outline/60 bg-canvas/90 px-4 py-3 backdrop-blur md:px-8">
      <button onClick={onOpenMenu} className="rounded-full p-2 hover:bg-surface lg:hidden" aria-label="Mở menu">
        <Menu size={22} />
      </button>

      <label className="relative hidden max-w-md flex-1 md:block">
        <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-navy/40" />
        <input
          type="search"
          placeholder="Tìm kiếm truyện, chủ đề EQ, bài học..."
          className="w-full rounded-full border-[1.5px] border-outline bg-white py-2.5 pr-4 pl-11 text-sm outline-none transition placeholder:text-navy/40 focus:border-secondary focus:ring-[3px] focus:ring-secondary/15"
        />
      </label>

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <ChildSwitcher />
        {parent.creditBalance != null && (
          <Link
            to={ROUTES.PARENT.BILLING}
            title="Credit AI còn lại trong tháng"
            className="hidden items-center gap-1.5 rounded-full border border-outline bg-white px-3 py-2 text-xs font-bold hover:bg-surface sm:flex"
          >
            <Coins size={15} className="text-primary" /> {parent.creditBalance} credit
          </Link>
        )}
        <InitialAvatar name={parent.name} className="h-9 w-9 text-sm ring-2 ring-primary-tint" />
      </div>
    </header>
  );
}

export default ParentTopbar;
