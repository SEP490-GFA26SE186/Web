import StoryCover from "../StoryCover";
import CaselTag from "./CaselTag";
import { KindBadge, StoryAction, StoryFacts } from "./LibraryStoryCard";
import { coverGradient, getProgressLabel } from "./storyMeta";

// Dạng danh sách của thẻ truyện (chế độ xem "list")
function LibraryStoryRow({ story }) {
  const progress = getProgressLabel(story);

  return (
    <article className="group card flex flex-col gap-4 p-3 transition hover:shadow-mid sm:flex-row sm:items-center">
      <StoryCover
        emoji={story.coverEmoji}
        gradient={coverGradient(story.storyId)}
        alt={story.title}
        className="aspect-[4/3] w-full shrink-0 rounded-2xl sm:w-32 [&_span[role=img]]:text-5xl"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <CaselTag competency={story.topic.competency} className="bg-secondary-tint" />
          <KindBadge story={story} />
        </div>
        <h3 className="mt-2 line-clamp-1 text-lg group-hover:text-primary-dark">{story.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-navy/65">Bài học: {story.topic.title}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy/60">
          <StoryFacts story={story} />
          <span className={progress.className}>{progress.text}</span>
        </div>
      </div>

      <div className="sm:w-44">
        <StoryAction story={story} compact />
      </div>
    </article>
  );
}

export default LibraryStoryRow;
