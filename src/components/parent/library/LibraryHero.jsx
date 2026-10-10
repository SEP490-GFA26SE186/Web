import { BookOpen, PlusCircle, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { CASEL_OPTIONS } from "../../../constants/casel";
import { ROUTES } from "../../../constants/routes";
import FilterSelect from "./FilterSelect";

const COMPETENCY_OPTIONS = [{ value: "all", label: "Tất cả" }, ...CASEL_OPTIONS];

const TABS = [
  { value: "all", label: "Tất cả" },
  { value: "reading", label: "Đang đọc" },
  { value: "completed", label: "Đã đọc xong" },
  { value: "not_started", label: "Chưa đọc" },
];

function LibraryHero({ childName, counts, search, onSearchChange, competency, onCompetencyChange, tab, onTabChange }) {
  return (
    <section className="relative overflow-hidden rounded-stage border border-outline bg-gradient-to-r from-surface via-white to-surface p-6 shadow-low">
      <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/3 -bottom-10 h-48 w-48 rounded-full bg-secondary/15 blur-2xl" />

      <div className="relative flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-extrabold tracking-wider text-primary-dark uppercase">
            <BookOpen size={14} /> Giá sách của bé
          </p>
          <h1 className="text-3xl">Tủ sách của {childName}</h1>
          <p className="mt-1 text-navy/70">
            Truyện ba mẹ đã tạo và xem lại, cùng truyện mua từ chợ — bé mở đọc trong Chế độ Trẻ Em
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-low">
            <Sparkles size={16} className="text-primary" />
            {counts ? `${counts.completed}/${counts.all}` : "…"} Đã đọc xong
          </span>
          <Link to={ROUTES.PARENT.STUDIO} className="btn-primary px-5 py-2 text-sm">
            <PlusCircle size={18} /> Tạo truyện mới
          </Link>
        </div>
      </div>

      <div className="relative mt-6 flex flex-col items-stretch justify-between gap-3 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-navy/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên truyện hoặc bài học..."
            className="w-full rounded-full border-[1.5px] border-outline bg-white py-2.5 pr-4 pl-11 text-sm transition outline-none placeholder:text-navy/40 focus:border-secondary focus:ring-[3px] focus:ring-secondary/15"
          />
        </label>
        <FilterSelect label="Năng lực" value={competency} onChange={onCompetencyChange} options={COMPETENCY_OPTIONS} />
      </div>

      <div className="relative -mx-1 mt-5 flex items-center gap-2 overflow-x-auto px-1 pb-1">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onTabChange(value)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition active:scale-95 ${
              tab === value
                ? "bg-primary font-bold text-white shadow-low"
                : "bg-white font-semibold text-navy/70 hover:bg-surface hover:text-navy"
            }`}
          >
            {label} ({counts?.[value] ?? 0})
          </button>
        ))}
      </div>
    </section>
  );
}

export default LibraryHero;
