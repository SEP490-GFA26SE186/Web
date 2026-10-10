import { BookOpen, FileText, Headphones, RotateCcw, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { STORY_LENGTH_LABELS } from "../../../constants/casel";
import { ROUTES } from "../../../constants/routes";
import StoryCover from "../StoryCover";
import CaselTag from "./CaselTag";
import { actionStyles, coverGradient, getPrimaryAction, getProgressLabel, getReadingStatus } from "./storyMeta";

const actionIcons = { replay: RotateCcw, book: BookOpen };

// private: truyện ba mẹ tự tạo · published: bản đăng bán đã mua trên chợ (dùng nguyên trạng)
export function KindBadge({ story }) {
  return story.kind === "published" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-primary-dark backdrop-blur">
      <ShoppingBag size={11} /> Mua từ chợ
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-navy/70 backdrop-blur">
      <Sparkles size={11} /> Ba mẹ tạo
    </span>
  );
}

export function StoryFacts({ story }) {
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="flex items-center gap-1">
        <FileText size={12} /> {story.totalPages} trang · {STORY_LENGTH_LABELS[story.length]}
      </span>
      {story.useTts && (
        <span className="flex items-center gap-1">
          <Headphones size={12} /> Có giọng đọc
        </span>
      )}
    </span>
  );
}

export function StoryAction({ story, compact = false }) {
  const action = getPrimaryAction(story);
  const Icon = actionIcons[action.icon];
  return (
    <Link
      to={ROUTES.KID.story(story.storyId)}
      className={`flex items-center justify-center gap-1.5 rounded-full py-2 text-sm font-bold transition ${
        compact ? "px-4" : "w-full"
      } ${actionStyles[action.variant]}`}
    >
      <Icon size={16} /> {action.label}
    </Link>
  );
}

function LibraryStoryCard({ story }) {
  const progress = getProgressLabel(story);
  const reading = getReadingStatus(story) === "reading";

  return (
    <article className="group card flex flex-col justify-between p-4 transition duration-300 hover:-translate-y-1 hover:shadow-high">
      <div>
        <StoryCover
          emoji={story.coverEmoji}
          gradient={coverGradient(story.storyId)}
          alt={story.title}
          className="mb-4 aspect-[4/3] w-full rounded-2xl"
        >
          <div className="absolute top-2 left-2 flex flex-wrap items-center gap-1">
            <CaselTag competency={story.topic.competency} short />
            <KindBadge story={story} />
          </div>
          {reading && (
            <div className="absolute inset-x-3 bottom-3 h-1.5 overflow-hidden rounded-full bg-white/60">
              <div className="h-full rounded-full bg-primary" style={{ width: `${story.readingProgress.progressPercentage}%` }} />
            </div>
          )}
        </StoryCover>

        <div className="mb-1 flex items-center justify-between gap-2 text-xs text-navy/60">
          <span className="line-clamp-1">Bài học: {story.topic.title}</span>
          <span className={`shrink-0 ${progress.className}`}>{progress.text}</span>
        </div>
        <h3 className="line-clamp-2 text-lg transition-colors group-hover:text-primary-dark">{story.title}</h3>
        <p className="mt-2 text-xs text-navy/60">
          <StoryFacts story={story} />
        </p>
      </div>

      <div className="mt-4 pt-2">
        <StoryAction story={story} />
      </div>
    </article>
  );
}

export default LibraryStoryCard;
