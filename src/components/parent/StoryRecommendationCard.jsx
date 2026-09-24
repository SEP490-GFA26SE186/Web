import { Headphones, Star } from "lucide-react";
import StoryCover from "./StoryCover";

function Rating({ value }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={15}
            className={i < Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-outline text-outline"}
          />
        ))}
      </div>
      <span className="text-xs text-navy/60">({value.toFixed(1)})</span>
    </div>
  );
}

function StoryRecommendationCard({ story }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-mid">
      <StoryCover
        cover={story.cover}
        emoji={story.coverEmoji}
        gradient={story.coverGradient}
        alt={story.title}
        className="aspect-[16/10]"
      >
        {story.hasAudio && (
          <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold">
            <Headphones size={12} /> Có Audio
          </span>
        )}
        {story.isNew && (
          <span className="absolute top-3 left-3 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white">
            Mới phát hành ✨
          </span>
        )}
        <span className="absolute right-3 bottom-3 rounded-full bg-navy/75 px-2.5 py-1 text-xs font-bold text-white">
          {story.minutes} phút
        </span>
      </StoryCover>

      <div className="flex flex-1 flex-col p-5">
        <span className={`self-start ${story.tagType === "eq" ? "tag-eq" : "tag-theme"}`}>{story.tag}</span>
        <h4 className="mt-3 text-lg leading-snug group-hover:text-primary-dark">{story.title}</h4>
        <p className="mt-2 line-clamp-2 text-sm text-navy/65">{story.description}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <Rating value={story.rating} />
          <button className="rounded-full bg-surface px-4 py-2 text-xs font-bold transition hover:bg-primary hover:text-white">
            Khám phá ngay
          </button>
        </div>
      </div>
    </article>
  );
}

export default StoryRecommendationCard;
