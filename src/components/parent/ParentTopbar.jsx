import { useEffect, useRef, useState } from "react";
import { Bell, Check, ChevronDown, Menu, Moon, Search, Smile } from "lucide-react";
import { useChildren, useParentProfile } from "../../hooks/useParent";
import useParentStore from "../../stores/parentStore";

function ChildSwitcher() {
  const { data: children = [] } = useChildren();
  const { selectedChildId, setSelectedChildId } = useParentStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = children.find((c) => c.id === selectedChildId);

  useEffect(() => {
    const onClick = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

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
            {current.name} ({current.age} tuổi)
          </span>
          <span className="block text-[11px] text-navy/70">⭐ {current.loveStars} Sao Yêu Thương</span>
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
              <span className="text-xl">{child.avatarEmoji}</span>
              <span className="flex-1 text-sm">
                <span className="block font-bold">{child.name}</span>
                <span className="text-xs text-navy/60">{child.age} tuổi · ⭐ {child.loveStars}</span>
              </span>
              {child.id === selectedChildId && <Check size={16} className="text-secondary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ParentTopbar({ onOpenMenu }) {
  const { data: parent } = useParentProfile();

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
        <button className="hidden items-center gap-1.5 rounded-full border border-outline bg-white px-3 py-2 text-xs font-semibold hover:bg-surface sm:flex">
          <Moon size={15} /> Giờ ngủ
        </button>
        <button className="relative rounded-full p-2 hover:bg-surface" aria-label="Thông báo">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-canvas" />
        </button>
        {parent && <img src={parent.avatar} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-primary-tint" />}
      </div>
    </header>
  );
}

export default ParentTopbar;
