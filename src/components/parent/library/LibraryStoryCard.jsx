import { BookOpen, Clock, Headphones, Heart, Library, Moon, RotateCcw, Star, Volume2 } from "lucide-react";
import StoryCover from "../StoryCover";
import TopicTag from "./TopicTag";
import { actionStyles, getPrimaryAction, getProgressLabel } from "./storyMeta";

const actionIcons = { replay: RotateCcw, book: BookOpen, stories: Library };

export function FavoriteButton({ story, onToggleFavorite, className = "" }) {
  return (
    <button
      onClick={() => onToggleFavorite(story)}
      aria-pressed={story.isFavorite}
      aria-label={story.isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
      className={`grid h-8 w-8 place-items-center rounded-full bg-white/85 backdrop-blur-sm transition hover:scale-110 ${
        story.isFavorite ? "text-primary" : "text-navy/60 hover:text-primary"
      } ${className}`}
    >
      <Heart size={16} className={story.isFavorite ? "fill-primary" : ""} />
    </button>
  );
}

export function StatusBadge({ story }) {
  if (story.isFavorite)
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full bg-primary-tint px-2.5 py-1 text-xs font-bold text-primary-dark">
        <Heart size={11} className="fill-primary-dark" /> Yêu thích
      </span>
    );
  if (story.status === "completed")
    return <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-primary-dark backdrop-blur">Đã xong</span>;
  if (story.status === "reading")
    return <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white">Đang đọc</span>;
  return null;
}

export function StoryActions({ story, compact = false }) {
  const action = getPrimaryAction(story);
  const Icon = actionIcons[action.icon];
  const listenColor = action.variant === "teal" ? "text-secondary hover:bg-secondary/10" : "text-primary hover:bg-primary/10";

  return (
    <div className="flex items-center gap-2">
      <button
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-bold transition ${
          compact ? "px-4" : ""
        } ${actionStyles[action.variant]}`}
      >
        <Icon size={16} /> {action.label}
      </button>
      <button
        title={story.isBedtime ? "Nghe audiobook" : "Nghe truyện"}
        className={`grid h-9 w-9 place-items-center rounded-full bg-surface transition ${listenColor}`}
      >
        <Volume2 size={18} />
      </button>
    </div>
  );
}

function LibraryStoryCard({ story, onToggleFavorite }) {
  const progress = getProgressLabel(story);

  return (
    <article className="group card flex flex-col justify-between p-4 transition duration-300 hover:-translate-y-1 hover:shadow-high">
      <div>
        <StoryCover
          cover={story.cover}
          emoji={story.coverEmoji}
          gradient={story.coverGradient}
          alt={story.title}
          className="mb-4 aspect-[4/3] w-full rounded-2xl"
        >
          <div className="absolute top-2 left-2 flex flex-wrap items-center gap-1 pr-10">
            <TopicTag topic={story.topic} />
            <StatusBadge story={story} />
          </div>
          <FavoriteButton story={story} onToggleFavorite={onToggleFavorite} className="absolute top-2 right-2" />
          <div className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-full bg-navy/60 px-3 py-1 text-xs text-white backdrop-blur-sm">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {story.minutes} phút
            </span>
            <span className="flex items-center gap-1 font-bold">
              <Star size={12} className="fill-amber-300 text-amber-300" /> {story.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              {story.isBedtime ? <Moon size={12} /> : <Headphones size={12} />}
              {story.isBedtime ? "Giờ ngủ" : "Audio"}
            </span>
          </div>
        </StoryCover>

        <div className="mb-1 flex items-center justify-between text-xs text-navy/60">
          <span>
            Chương {story.chapter}/{story.totalChapters}
          </span>
          <span className={progress.className}>{progress.text}</span>
        </div>
        <h3 className="line-clamp-1 text-lg transition-colors group-hover:text-primary-dark">{story.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-navy/65">{story.description}</p>
      </div>

      <div className="mt-4 pt-2">
        <StoryActions story={story} />
      </div>
    </article>
  );
}

export default LibraryStoryCard;
