import { BookOpen, Clock, Handshake, Headphones } from "lucide-react";
import StoryCover from "./StoryCover";

function ContinueReadingCard({ story }) {
  return (
    <section className="relative overflow-hidden rounded-stage bg-white p-5 shadow-mid md:p-8">
      <div className="pointer-events-none absolute -right-16 -bottom-16 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -top-12 -left-12 h-64 w-64 rounded-full bg-secondary/15 blur-2xl" />
      <div className="relative z-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
        <StoryCover
          cover={story.cover}
          emoji={story.coverEmoji}
          gradient={story.coverGradient}
          alt={story.title}
          className="aspect-[4/3] w-full rounded-card shadow-mid lg:col-span-4"
        >
          <span className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold">
            <BookOpen size={12} className="text-primary" />
            Chương {story.chapter}/{story.totalChapters}
          </span>
          <span className="absolute right-3 bottom-3 rounded-full bg-navy/75 px-2.5 py-1 text-xs font-bold text-white">
            Còn {story.minutesLeft} phút
          </span>
        </StoryCover>

        <div className="min-w-0 lg:col-span-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="tag-eq">
              <Handshake size={13} /> {story.skillTag}
            </span>
            <span className="flex items-center gap-1 text-xs text-navy/60">
              <Clock size={13} /> Lần đọc gần nhất: {story.lastReadAt}
            </span>
          </div>

          <p className="text-xs font-extrabold tracking-wider text-primary-dark">ĐANG ĐỌC DỞ DANG</p>
          <h2 className="mt-1 text-2xl leading-tight md:text-[28px]">{story.title}</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-navy/75">
            <span className="font-semibold text-navy">
              Chương {story.chapter}: {story.chapterTitle}
            </span>{" "}
            — {story.description}
          </p>

          <div className="mt-5 max-w-2xl">
            <div className="mb-1.5 flex justify-between text-xs">
              <span className="text-navy/60">Tiến độ câu chuyện</span>
              <span className="font-bold text-primary-dark">{story.progress}% hoàn thành</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-outline">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary-dark to-primary transition-all duration-700"
                style={{ width: `${story.progress}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-primary text-lg">
              <BookOpen size={20} /> Đọc tiếp cùng bé
            </button>
            <button className="inline-flex items-center gap-2 rounded-full bg-surface px-6 py-3 font-bold transition hover:bg-outline">
              <Headphones size={18} className="text-secondary" /> Nghe audio trước khi ngủ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContinueReadingCard;
