import { BookOpen, Brain, ClipboardCheck, Heart } from "lucide-react";
import StoryCover from "../StoryCover";
import { EQ_ICONS } from "./icons";

function PersonalizedCard({ story, childName }) {
  const EqIcon = EQ_ICONS[story.eqIcon] ?? Heart;

  return (
    <article
      className={`card flex flex-col p-4 transition duration-300 hover:shadow-high ${
        story.featured ? "ring-2 ring-primary/40" : ""
      }`}
    >
      <StoryCover
        cover={story.cover}
        emoji={story.coverEmoji}
        gradient={story.coverGradient}
        alt={story.title}
        className="h-48 w-full rounded-2xl"
      >
        <span className="absolute top-2.5 left-2.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-secondary-dark shadow-low backdrop-blur">
          {story.ageRange} • {story.minutes} phút
        </span>
        <span
          className={`absolute top-2.5 right-2.5 rounded-full px-3 py-1 text-xs font-bold shadow-low ${
            story.badge.highlight ? "bg-primary text-white" : "bg-white/90 text-navy backdrop-blur"
          }`}
        >
          {story.badge.label}
        </span>
      </StoryCover>

      <div className="flex flex-1 flex-col justify-between gap-3 pt-4">
        <div>
          <h3 className="text-lg">{story.title}</h3>
          <p className="mt-1.5 text-sm text-navy/65">{story.description}</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1 rounded-xl bg-secondary-tint p-2.5 text-xs">
            <p className="flex items-center gap-1.5 font-bold text-secondary-dark">
              <EqIcon size={15} /> EQ Mục tiêu: {story.eqGoal}
            </p>
            <p className="flex items-center gap-1.5 font-semibold text-primary-dark">
              <ClipboardCheck size={15} /> Nhiệm vụ: {story.mission}
            </p>
          </div>
          <button
            className={`mt-1 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition ${
              story.featured
                ? "bg-primary text-white shadow-low hover:-translate-y-0.5 hover:shadow-mid"
                : "bg-surface hover:bg-primary hover:text-white"
            }`}
          >
            <BookOpen size={16} />
            {story.featured ? `Đọc cùng ${childName.replace(/^Bé\s+/, "")} tối nay` : "Khám phá câu chuyện"}
          </button>
        </div>
      </div>
    </article>
  );
}

function PersonalizedSection({ child, data, isLoading }) {
  return (
    <section className="flex flex-col gap-5 rounded-stage bg-secondary-tint/60 p-5 md:p-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-secondary text-white shadow-mid">
            <Brain size={30} />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl">Gợi ý cá nhân hóa cho {child.name} 🎯</h2>
              <span className="rounded-full bg-secondary/15 px-2.5 py-0.5 text-xs font-bold text-secondary-dark">
                {child.age} tuổi
              </span>
            </div>
            <p className="mt-1 text-navy/70">
              Dựa trên mục tiêu tuần này của gia đình:{" "}
              <strong className="text-secondary-dark">{data?.goal ?? "…"}</strong>
            </p>
          </div>
        </div>
        {data && (
          <div className="flex items-center gap-3 self-start rounded-full bg-white px-4 py-2 shadow-low lg:self-auto">
            <span className="text-xs font-semibold text-navy/60">Tiến độ tuần:</span>
            <div className="h-2.5 w-32 overflow-hidden rounded-full bg-outline">
              <div className="h-full rounded-full bg-secondary transition-all duration-700" style={{ width: `${data.weeklyProgress}%` }} />
            </div>
            <span className="text-xs font-bold text-secondary-dark">{data.weeklyProgress}% Đạt mục tiêu</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {isLoading || !data
          ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-[460px] animate-pulse rounded-card bg-white/70" />)
          : data.stories.map((story) => <PersonalizedCard key={story.id} story={story} childName={child.name} />)}
      </div>
    </section>
  );
}

export default PersonalizedSection;
