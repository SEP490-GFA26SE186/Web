import { BookOpen, Clock, FileText } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import { formatRelativeDay } from "../../utils/format";
import { Badge, Button, Card, ProgressBar } from "../ui";
import CaselTag from "./library/CaselTag";
import { coverOf } from "./library/storyMeta";
import StoryCover from "./StoryCover";

// Truyện bé đang đọc dở gần nhất (bookshelf item có readingProgress chưa hoàn thành)
function ContinueReadingCard({ story }) {
  const { currentPageOrder, progressPercentage, lastActivityAt } = story.readingProgress;

  return (
    <Card reveal padding="none" className="overflow-hidden rounded-stage bg-gradient-to-br from-white via-white to-primary-tint/70 p-4 md:p-6">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
        <StoryCover
          cover={coverOf(story)}
          title={story.title}
          size="lg"
          className="group aspect-[4/3] w-full overflow-hidden rounded-card shadow-mid lg:col-span-4"
        >
          <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold tabular-nums backdrop-blur">
            <FileText size={12} className="text-primary" />
            Trang {currentPageOrder}/{story.totalPages}
          </span>
        </StoryCover>

        <div className="min-w-0 lg:col-span-8 lg:py-2">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge tone="primary" icon={BookOpen}>
              Đang đọc dở
            </Badge>
            <CaselTag competency={story.topic?.competency} className="bg-secondary-tint" />
          </div>

          <h2 className="text-2xl leading-tight tracking-tight md:text-[28px]">{story.title}</h2>
          {story.topic && (
            <p className="mt-2 text-[15px] text-navy/65">
              Bài học: <span className="font-semibold text-navy">{story.topic.title}</span>
            </p>
          )}

          <div className="mt-5 max-w-xl">
            <div className="mb-2 flex items-baseline justify-between gap-3 text-xs">
              <span className="flex items-center gap-1 text-navy/55">
                <Clock size={13} /> Đọc lần cuối {formatRelativeDay(lastActivityAt)}
              </span>
              <span className="font-bold text-primary-dark tabular-nums">{progressPercentage}%</span>
            </div>
            <ProgressBar value={progressPercentage} label="Tiến độ câu chuyện" />
          </div>

          <Button size="lg" icon={BookOpen} to={ROUTES.KID.story(story.storyId)} className="mt-6">
            Đọc tiếp ở Kid Mode
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ContinueReadingCard;
