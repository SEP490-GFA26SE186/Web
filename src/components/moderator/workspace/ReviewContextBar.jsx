import { Baby, BadgeCheck, BookOpen, CircleCheckBig, Lock, Tag, User } from "lucide-react";
import { formatVND } from "../../../utils/format";

function ReviewContextBar({ story, approvedCount, total }) {
  const percent = Math.round((approvedCount / total) * 100);
  const done = approvedCount === total;

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-stage bg-surface px-5 py-4 shadow-low">
      <div className="flex min-w-0 items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-tint text-primary shadow-low">
          <BookOpen size={26} />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl">{story.title}</h1>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary-tint px-2 py-0.5 text-xs font-bold text-secondary-dark">
              <BadgeCheck size={14} /> Khung Chuẩn CASEL
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-navy/65">
            <span className="flex items-center gap-1">
              <User size={15} className="text-primary" /> Tác giả: <strong className="text-navy">{story.author}</strong>
              <span className="rounded bg-outline px-1.5 py-0.5 text-[11px] font-bold text-secondary-dark">{story.authorBadge}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Baby size={15} className="text-secondary" /> Lứa tuổi: <strong className="text-navy">{story.ageRange}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Tag size={15} className="text-primary" /> Giá niêm yết: <strong className="text-navy">{formatVND(story.price)}</strong>
            </span>
            <span>•</span>
            <span className="rounded-full bg-primary-tint px-2 py-0.5 text-xs font-bold text-primary-dark">{story.template}</span>
          </div>
        </div>
      </div>

      <div className="flex w-full min-w-[280px] flex-col gap-1 rounded-card bg-white px-4 py-2.5 shadow-low sm:w-auto">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1 text-xs font-bold text-navy/60">
            <CircleCheckBig size={15} className="text-secondary" /> Tiến độ kiểm duyệt
          </span>
          <span className="font-display font-bold text-secondary-dark">
            {approvedCount} / {total} trang ({percent}%)
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-outline">
          <div className="h-full rounded-full bg-secondary transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
        <span className="flex items-center gap-1 text-[11px] text-navy/60">
          <Lock size={11} className={done ? "text-secondary" : "text-primary"} />
          {done ? "Đã đủ điều kiện xuất bản" : `Nút xuất bản chỉ mở khi đủ ${total}/${total} trang & đạt toàn bộ tiêu chí`}
        </span>
      </div>
    </header>
  );
}

export default ReviewContextBar;
