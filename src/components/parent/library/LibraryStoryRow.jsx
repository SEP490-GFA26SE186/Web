import { Clock, Moon, Star } from "lucide-react";
import StoryCover from "../StoryCover";
import TopicTag from "./TopicTag";
import { FavoriteButton, StatusBadge, StoryActions } from "./LibraryStoryCard";
import { getProgressLabel } from "./storyMeta";

// Dạng danh sách của thẻ truyện (chế độ xem "list")
function LibraryStoryRow({ story, onToggleFavorite }) {
  const progress = getProgressLabel(story);

  return (
    <article className="group card flex flex-col gap-4 p-3 transition hover:shadow-mid sm:flex-row sm:items-center">
      <StoryCover
        cover={story.cover}
        emoji={story.coverEmoji}
        gradient={story.coverGradient}
        alt={story.title}
        className="aspect-[4/3] w-full shrink-0 rounded-2xl sm:w-32 [&_span[role=img]]:text-5xl"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <TopicTag topic={story.topic} className="bg-secondary-tint" />
          <StatusBadge story={story} />
        </div>
        <h3 className="mt-2 line-clamp-1 text-lg group-hover:text-primary-dark">{story.title}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-navy/65">{story.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy/60">
          <span>
            Chương {story.chapter}/{story.totalChapters}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {story.minutes} phút
          </span>
          <span className="flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400" /> {story.rating.toFixed(1)}
          </span>
          {story.isBedtime && (
            <span className="flex items-center gap-1 text-secondary-dark">
              <Moon size={12} /> Giờ ngủ
            </span>
          )}
          <span className={progress.className}>{progress.text}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:w-56">
        <FavoriteButton story={story} onToggleFavorite={onToggleFavorite} className="shrink-0 bg-surface" />
        <div className="flex-1">
          <StoryActions story={story} compact />
        </div>
      </div>
    </article>
  );
}

export default LibraryStoryRow;
