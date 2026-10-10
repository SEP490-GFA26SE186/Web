import { Clock, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import { formatRelativeDay } from "../../../utils/format";
import StoryCover from "../StoryCover";
import CaselTag from "./CaselTag";
import { coverGradient } from "./storyMeta";

const accents = {
  primary: { bar: "bg-primary", text: "text-primary-dark", hover: "group-hover:text-primary-dark", progress: "from-primary-dark to-primary", button: "bg-primary" },
  secondary: { bar: "bg-secondary", text: "text-secondary-dark", hover: "group-hover:text-secondary-dark", progress: "from-secondary/60 to-secondary", button: "bg-secondary" },
};

function ContinueReadingItem({ story, accent = "primary" }) {
  const a = accents[accent];
  const { currentPageOrder, progressPercentage, lastActivityAt } = story.readingProgress;

  return (
    <article className="group card relative flex flex-col gap-4 overflow-hidden p-4 pl-6 transition duration-300 hover:shadow-high sm:flex-row">
      <span className={`absolute inset-y-0 left-0 w-2 ${a.bar}`} />

      <StoryCover
        emoji={story.coverEmoji}
        gradient={coverGradient(story.storyId)}
        alt={story.title}
        className="h-40 w-full shrink-0 rounded-2xl shadow-low sm:w-36"
      />

      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <div className="flex items-center justify-between gap-2">
            <CaselTag competency={story.topic.competency} className="bg-secondary-tint" />
            <span className="shrink-0 text-xs text-navy/60">
              Trang {currentPageOrder}/{story.totalPages}
            </span>
          </div>
          <h3 className={`mt-2 line-clamp-1 text-xl transition-colors ${a.hover}`}>{story.title}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-navy/65">Bài học: {story.topic.title}</p>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs text-navy/60">
            <span>Tiến độ đọc</span>
            <span className={`font-bold ${a.text}`}>{progressPercentage}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-outline">
            <div className={`h-full rounded-full bg-gradient-to-r ${a.progress}`} style={{ width: `${progressPercentage}%` }} />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-navy/60">
              <Clock size={13} /> Đọc lần cuối {formatRelativeDay(lastActivityAt)}
            </span>
            <Link
              to={ROUTES.KID.story(story.storyId)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold text-white shadow-low transition hover:-translate-y-0.5 hover:shadow-mid ${a.button}`}
            >
              Đọc tiếp <Play size={14} className="fill-white" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ContinueReadingItem;
