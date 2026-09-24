import { Brain, SlidersHorizontal, WandSparkles } from "lucide-react";
import { STAT_ICONS } from "./icons";

const statTones = {
  orange: "bg-primary-tint text-primary",
  teal: "bg-secondary-tint text-secondary",
  neutral: "bg-surface text-primary",
  navy: "bg-slate-100 text-navy-soft",
};

function Sparkle({ className, style }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
      <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
    </svg>
  );
}

function ExploreHero({ stats = [], onBrowseTopics }) {
  return (
    <div className="relative">
      <section className="relative overflow-hidden rounded-stage bg-gradient-to-r from-primary via-primary-dark to-secondary p-8 pb-14 text-white shadow-high md:p-10 md:pb-16">
        <div className="pointer-events-none absolute -top-16 -right-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/4 h-96 w-96 rounded-full bg-secondary/30 blur-2xl" />
        <Sparkle className="absolute top-6 right-16 h-12 w-12 animate-pulse text-teal-200/50" />
        <Sparkle className="absolute right-1/3 bottom-12 h-8 w-8 animate-bounce text-orange-100/60" style={{ animationDuration: "3s" }} />

        <div className="relative z-10 flex max-w-3xl flex-col items-start gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-1 text-xs font-bold backdrop-blur-md">
            <Brain size={15} /> Khung phát triển EQ chuẩn quốc tế • Hơn 10,000 phụ huynh tin cậy
          </span>
          <h1 className="max-w-2xl text-3xl leading-tight md:text-4xl">
            Biến mỗi câu chuyện thành một bài học nhỏ diệu kỳ ✨
          </h1>
          <p className="max-w-2xl text-lg text-white/90">
            Hơn 100+ kịch bản truyện tương tác kết hợp AI Game Master và rèn luyện trí tuệ cảm xúc (EQ) chuẩn khoa học
            tâm lý trẻ em.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-primary-dark shadow-mid transition duration-200 hover:-translate-y-0.5 hover:shadow-high">
              <WandSparkles size={20} /> Tự tạo truyện theo tính cách bé
            </button>
            <button
              onClick={onBrowseTopics}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-6 py-3.5 font-bold backdrop-blur-md transition hover:bg-white/25"
            >
              <SlidersHorizontal size={20} /> Duyệt theo chủ đề
            </button>
          </div>
        </div>
      </section>

      {/* Thanh số liệu nổi đè lên banner */}
      <div className="relative z-20 mx-4 -mt-8 grid grid-cols-2 gap-4 rounded-card bg-white p-5 shadow-mid md:mx-6 lg:grid-cols-4 lg:divide-x lg:divide-outline">
        {stats.map(({ id, value, label, icon, tone }) => {
          const Icon = STAT_ICONS[icon] ?? Brain;
          return (
            <div key={id} className="flex items-center gap-3 lg:justify-center lg:px-4">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${statTones[tone]}`}>
                <Icon size={20} />
              </span>
              <div className="min-w-0 leading-tight">
                <p className="font-display text-lg font-bold">{value}</p>
                <p className="text-xs font-semibold text-navy/60">{label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExploreHero;
