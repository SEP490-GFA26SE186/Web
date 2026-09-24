import { LayoutGrid } from "lucide-react";

function CategoryPills({ categories, value, onChange }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-xl">
          <LayoutGrid size={20} className="text-primary" /> Chủ đề & Kỹ năng Cảm xúc
        </h2>
        <span className="text-xs font-semibold text-navy/60">Chọn lọc kịch bản định hướng hành vi</span>
      </div>
      <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 py-1" role="tablist">
        {categories.map((c) => {
          const active = c.id === value;
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(c.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold shadow-low transition active:scale-95 ${
                active ? "bg-primary text-white" : "bg-white text-navy hover:bg-surface"
              }`}
            >
              {c.emoji && <span>{c.emoji}</span>}
              {c.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default CategoryPills;
