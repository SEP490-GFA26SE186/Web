import { Link } from "react-router-dom";
import { BookOpen, Bot, ChevronRight, Loader2, PenLine, Plus } from "lucide-react";
import CaselTag from "../../../components/parent/library/CaselTag";
import { coverOf } from "../../../components/parent/library/storyMeta";
import StoryCover from "../../../components/parent/StoryCover";
import { STORY_STATUS_LABELS } from "../../../constants/story";
import { STORY_LENGTH_LABELS } from "../../../constants/casel";
import { ROUTES } from "../../../constants/routes";
import { useStories } from "../../../hooks/useStudio";

const statusOf = (story) => {
  if (story.status === "generating") return { label: STORY_STATUS_LABELS.generating, tone: "bg-primary-tint text-primary-dark" };
  if (story.reviewedAt) return { label: "Đã hoàn tất", tone: "bg-secondary-tint text-secondary-dark" };
  if (story.status === "ready") return { label: "Chờ ba mẹ xem lại", tone: "bg-primary-tint text-primary-dark" };
  return { label: STORY_STATUS_LABELS.draft, tone: "bg-navy-tint text-navy" };
};

// Danh sách truyện riêng ba mẹ đã tạo (GET /stories)
function StudioPage() {
  const { data, isLoading, error } = useStories({ limit: 50 });
  const stories = data?.data ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Sáng tác truyện</h1>
          <p className="mt-1 text-navy/60">Truyện ba mẹ tạo riêng cho bé — AI viết giúp hoặc tự viết.</p>
        </div>
        <Link to={ROUTES.PARENT.STUDIO_NEW} className="btn-primary">
          <Plus size={18} /> Tạo truyện mới
        </Link>
      </div>

      {isLoading && (
        <div className="grid place-items-center py-16">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      )}
      {error && <p className="card p-6 text-danger">{error.message}</p>}

      {!isLoading && !error && stories.length === 0 && (
        <div className="card flex flex-col items-center gap-3 p-10 text-center">
          <BookOpen size={40} className="text-primary" />
          <h2 className="text-xl">Chưa có truyện nào</h2>
          <p className="text-navy/60">Bắt đầu bằng một bài học và chuyện thật ở nhà của bé.</p>
          <Link to={ROUTES.PARENT.STUDIO_NEW} className="btn-primary mt-2">
            <Plus size={18} /> Tạo truyện đầu tiên
          </Link>
        </div>
      )}

      <ul className="space-y-3">
        {stories.map((story) => {
          const status = statusOf(story);
          return (
            <li key={story.id}>
              <Link
                to={ROUTES.PARENT.studioStory(story.id)}
                className="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-mid"
              >
                <StoryCover cover={coverOf(story)} title={story.title} size="sm" className="h-20 w-20 shrink-0 rounded-2xl" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <CaselTag competency={story.topic?.competency} className="bg-secondary-tint" short />
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${status.tone}`}>{status.label}</span>
                  </div>
                  <h2 className="truncate text-lg">{story.title}</h2>
                  <p className="flex items-center gap-1 text-sm text-navy/60">
                    {story.mode === "manual" ? <PenLine size={14} /> : <Bot size={14} />}
                    {story.mode === "manual" ? "Tự viết" : `AI viết giúp · ${STORY_LENGTH_LABELS[story.length]}`} ·{" "}
                    {story.pageCount} trang · {story.checkpointCount} điểm dừng
                  </p>
                </div>
                <ChevronRight className="shrink-0 text-navy/40" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default StudioPage;
