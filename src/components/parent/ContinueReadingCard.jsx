import { BookOpen, Clock, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { formatRelativeDay } from "../../utils/format";
import CaselTag from "./library/CaselTag";
import { coverGradient } from "./library/storyMeta";
import StoryCover from "./StoryCover";

// Truyện bé đang đọc dở gần nhất (bookshelf item có readingProgress chưa hoàn thành)
function ContinueReadingCard({ story }) {
  const { currentPageOrder, progressPercentage, lastActivityAt } = story.readingProgress;

  return (
    <section className="relative overflow-hidden rounded-stage bg-white p-5 shadow-mid md:p-8">
      <div className="pointer-events-none absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -top-12 -left-12 h-64 w-64 rounded-full bg-secondary/15 blur-2xl" />
      <div className="relative z-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
        <StoryCover
          emoji={story.coverEmoji}
          gradient={coverGradient(story.storyId)}
          alt={story.title}
          className="aspect-[4/3] w-full rounded-card shadow-mid lg:col-span-4"
        >
          <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold">
            <FileText size={12} className="text-primary" />
            Trang {currentPageOrder}/{story.totalPages}
          </span>
        </StoryCover>

        <div className="min-w-0 lg:col-span-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <CaselTag competency={story.topic.competency} className="bg-secondary-tint" />
            <span className="flex items-center gap-1 text-xs text-navy/60">
              <Clock size={13} /> Đọc lần cuối {formatRelativeDay(lastActivityAt)}
            </span>
          </div>

          <p className="text-xs font-extrabold tracking-wider text-primary-dark">ĐANG ĐỌC DỞ DANG</p>
          <h2 className="mt-1 text-2xl leading-tight md:text-[28px]">{story.title}</h2>
          <p className="mt-2 text-[15px] text-navy/75">
            Bài học: <span className="font-semibold text-navy">{story.topic.title}</span>
          </p>

          <div className="mt-5 max-w-2xl">
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-navy/60">Tiến độ câu chuyện</span>
              <span className="font-bold text-primary-dark">{progressPercentage}% hoàn thành</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-outline">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-dark to-primary transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="mt-6">
            <Link to={ROUTES.KID.story(story.storyId)} className="btn-primary text-lg">
              <BookOpen size={20} /> Mở Kid Mode đọc tiếp
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContinueReadingCard;
