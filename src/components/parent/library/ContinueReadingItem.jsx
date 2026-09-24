import { Clock, Headphones, Play } from "lucide-react";
import StoryCover from "../StoryCover";
import TopicTag from "./TopicTag";

const accents = {
  primary: {
    bar: "bg-primary",
    text: "text-primary-dark",
    hover: "group-hover:text-primary-dark",
    progress: "from-primary-dark to-primary",
    button: "bg-primary",
  },
  secondary: {
    bar: "bg-secondary",
    text: "text-secondary-dark",
    hover: "group-hover:text-secondary-dark",
    progress: "from-secondary/60 to-secondary",
    button: "bg-secondary",
  },
};

function ContinueReadingItem({ story, accent = "primary" }) {
  const a = accents[accent];

  return (
    <article className="group card relative flex flex-col gap-4 overflow-hidden p-4 pl-6 transition duration-300 hover:shadow-high sm:flex-row">
      <span className={`absolute inset-y-0 left-0 w-2 ${a.bar}`} />

      <StoryCover
        cover={story.cover}
        emoji={story.coverEmoji}
        gradient={story.coverGradient}
        alt={story.title}
        className="h-44 w-full shrink-0 rounded-2xl shadow-low sm:w-36"
      >
        {story.audio && (
          <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-navy/70 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
            <Headphones size={11} /> {story.audio === "narrated" ? "Tự kể" : "Audio AI"}
          </span>
        )}
      </StoryCover>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <div className="flex items-center justify-between gap-2">
            <TopicTag topic={story.topic} prefix="Bài học: " className="bg-secondary-tint" />
            <span className="shrink-0 text-xs text-navy/60">
              Chương {story.chapter}/{story.totalChapters}
            </span>
          </div>
          <h3 className={`mt-2 line-clamp-1 text-xl transition-colors ${a.hover}`}>{story.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-navy/65">{story.description}</p>
        </div>

        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs text-navy/60">
            <span>Tiến độ đọc</span>
            <span className={`font-bold ${a.text}`}>{story.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-outline">
            <div className={`h-full rounded-full bg-gradient-to-r ${a.progress}`} style={{ width: `${story.progress}%` }} />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-navy/60">
              <Clock size={13} /> Còn {story.minutesLeft} phút
            </span>
            <button
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold text-white shadow-low transition hover:-translate-y-0.5 hover:shadow-mid ${a.button}`}
            >
              Đọc tiếp <Play size={14} className="fill-white" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default ContinueReadingItem;
