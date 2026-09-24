import { ArrowDownUp, BookOpen, Heart, Moon, PlusCircle, Search, Sparkles } from "lucide-react";
import { EQ_TOPICS } from "../../../constants/eqTopics";
import FilterSelect from "./FilterSelect";

const AGE_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "2-3", label: "2-3 tuổi" },
  { value: "4-6", label: "4-6 tuổi" },
  { value: "7-9", label: "7-9 tuổi" },
];

const DURATION_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "lt10", label: "Dưới 10 phút" },
  { value: "10to15", label: "10 - 15 phút" },
  { value: "gt15", label: "Trên 15 phút" },
];

const TOPIC_OPTIONS = [
  { value: "all", label: "Tất cả" },
  ...Object.entries(EQ_TOPICS).map(([value, { label }]) => ({ value, label })),
];

const SORT_OPTIONS = [
  { value: "recent", label: "Gần đây nhất" },
  { value: "rating", label: "Được đánh giá cao" },
  { value: "shortest", label: "Thời lượng ngắn nhất" },
];

const TABS = [
  { value: "all", label: "Tất cả" },
  { value: "reading", label: "Đang đọc" },
  { value: "completed", label: "Đã hoàn thành" },
  { value: "favorite", label: "Yêu thích", icon: Heart, iconClass: "fill-primary text-primary", iconAfter: true },
  { value: "bedtime", label: "Audiobook giờ ngủ", icon: Moon, iconClass: "text-secondary" },
];

function LibraryHero({ childName, counts, search, onSearchChange, filters, onFilterChange, tab, onTabChange }) {
  return (
    <section className="relative overflow-hidden rounded-stage border border-outline bg-gradient-to-r from-surface via-white to-surface p-6 shadow-low">
      <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 -bottom-10 h-48 w-48 rounded-full bg-secondary/15 blur-2xl" />

      <div className="relative flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-extrabold tracking-wider text-primary-dark uppercase">
            <BookOpen size={14} /> Thư viện truyện cá nhân hóa
          </p>
          <h1 className="text-3xl">Tủ sách của bé</h1>
          <p className="mt-1 text-navy/70">
            Kho tàng {counts?.all ?? "…"} câu chuyện tương tác và audiobook dành riêng cho {childName}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-low">
            <Sparkles size={16} className="text-primary" />
            {counts ? `${counts.completed}/${counts.all}` : "…"} Hoàn thành
          </span>
          <button className="btn-primary px-5 py-2 text-sm">
            <PlusCircle size={18} /> Tạo truyện mới
          </button>
        </div>
      </div>

      <div className="relative mt-6 flex flex-col items-stretch justify-between gap-3 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-navy/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm theo tên truyện, bài học EQ, nhân vật..."
            className="w-full rounded-full border-[1.5px] border-outline bg-white py-2.5 pr-4 pl-11 text-sm transition outline-none placeholder:text-navy/40 focus:border-secondary focus:ring-[3px] focus:ring-secondary/15"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect label="Độ tuổi" value={filters.age} onChange={(v) => onFilterChange("age", v)} options={AGE_OPTIONS} />
          <FilterSelect label="Thời lượng" value={filters.duration} onChange={(v) => onFilterChange("duration", v)} options={DURATION_OPTIONS} />
          <FilterSelect label="Chủ đề EQ" value={filters.topic} onChange={(v) => onFilterChange("topic", v)} options={TOPIC_OPTIONS} />
          <FilterSelect label="Sắp xếp" value={filters.sort} onChange={(v) => onFilterChange("sort", v)} options={SORT_OPTIONS} highlight icon={ArrowDownUp} />
        </div>
      </div>

      <div className="relative -mx-1 mt-5 flex items-center gap-2 overflow-x-auto px-1 pb-1">
        {TABS.map(({ value, label, icon: Icon, iconClass, iconAfter }) => {
          const active = tab === value;
          const icon = Icon && <Icon size={14} className={active ? "" : iconClass} />;
          return (
            <button
              key={value}
              onClick={() => onTabChange(value)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition active:scale-95 ${
                active
                  ? "bg-primary font-bold text-white shadow-low"
                  : "bg-white font-semibold text-navy/70 hover:bg-surface hover:text-navy"
              }`}
            >
              {!iconAfter && icon}
              {label} ({counts?.[value] ?? 0})
              {iconAfter && icon}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default LibraryHero;
