import { Clock, Heart, Play, Star, Zap } from "lucide-react";
import StoryCover from "../StoryCover";
import { EQ_ICONS, formatReaders } from "./icons";

function AccessBadge({ access }) {
  if (access.type === "stars")
    return (
      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy shadow-low backdrop-blur">
        {access.cost} ⭐ Sao
      </span>
    );
  if (access.type === "pro")
    return <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-low">Gói Pro</span>;
  return (
    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-white shadow-low">Miễn phí trong Pro</span>
  );
}

function PopularStoryCard({ story }) {
  const EqIcon = EQ_ICONS[story.eqIcon] ?? Heart;

  return (
    <article className="group card flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-high">
      <StoryCover
        cover={story.cover}
        emoji={story.coverEmoji}
        gradient={story.coverGradient}
        alt={story.title}
        className="h-48 w-full [&>div]:transition-transform [&>div]:duration-500 group-hover:[&>div]:scale-105"
      >
        <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-secondary-dark shadow-low backdrop-blur">
          <Clock size={13} /> {story.minutes} phút
        </span>
        <span className="absolute top-3 right-3">
          <AccessBadge access={story.access} />
        </span>
      </StoryCover>

      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="tag-eq py-0.5">{story.ageRange}</span>
            <span className="flex items-center gap-1 text-xs text-navy/60">
              <Star size={13} className="fill-primary text-primary" />
              {story.rating.toFixed(2)} ({formatReaders(story.readers)} mẹ đọc)
            </span>
          </div>
          <h3 className="line-clamp-1 text-lg transition-colors group-hover:text-primary-dark">{story.title}</h3>
          <p className="line-clamp-2 text-sm text-navy/65">{story.description}</p>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <p className="flex items-center gap-1.5 rounded-xl bg-secondary-tint px-2.5 py-1.5 text-xs font-bold text-secondary-dark">
            <EqIcon size={15} className="shrink-0" /> EQ: {story.eqLabel}
          </p>
          {story.hasMission && (
            <p className="flex items-center gap-1 text-xs font-bold text-primary-dark">
              <Zap size={14} className="fill-primary text-primary" /> Có nhiệm vụ đời thực kết nối
            </p>
          )}
          <button className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-bold transition hover:bg-primary hover:text-white">
            <Play size={15} /> Khám phá câu chuyện
          </button>
        </div>
      </div>
    </article>
  );
}

export default PopularStoryCard;
