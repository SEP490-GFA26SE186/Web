import { ArrowLeftRight, BookOpen, CheckCircle2, Pencil, Plus, Timer, Trash2 } from "lucide-react";
import { useChildUsage } from "../../../hooks/useChildProfile";
import { ageLabel, childEmoji, formatBirthDate } from "../../../utils/child";

function Avatar({ child, className }) {
  return (
    <div className={`grid place-items-center rounded-3xl p-1 shadow-inner ${className}`}>
      <span className="grid h-full w-full place-items-center rounded-2xl bg-white/60 select-none">{childEmoji(child)}</span>
    </div>
  );
}

// Thời lượng đã dùng hôm nay so với giới hạn — GET /children/:id/usage
function TodayUsage({ childId }) {
  const { data: usage, isLoading } = useChildUsage(childId);

  if (isLoading || !usage) return <div className="mt-3 h-8 w-full max-w-sm animate-pulse rounded-full bg-surface" />;

  const percent = Math.min(100, Math.round((usage.usedMinutes / usage.dailyLimitMinutes) * 100));
  return (
    <div className="mt-3 flex w-full max-w-sm items-center gap-3 rounded-full bg-surface px-3 py-1.5">
      <Timer size={15} className="shrink-0 text-primary" />
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-outline">
        <div
          className={`h-full rounded-full transition-all duration-700 ${usage.isLimitReached ? "bg-danger" : "bg-primary"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="shrink-0 text-xs font-bold text-navy/60">
        Hôm nay {usage.usedMinutes} / {usage.dailyLimitMinutes} phút
      </span>
    </div>
  );
}

// Thẻ lớn của bé đang được chọn
export function ActiveChildCard({ child, onEdit, onDelete }) {
  return (
    <div className="relative h-full overflow-hidden rounded-card bg-white p-6 shadow-mid">
      <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative z-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="relative">
          <Avatar child={child} className="h-24 w-24 bg-primary-tint text-5xl sm:h-28 sm:w-28 sm:text-6xl" />
          <button
            onClick={onEdit}
            aria-label="Sửa hồ sơ bé"
            className="absolute -right-2 -bottom-2 grid h-8 w-8 place-items-center rounded-full bg-primary text-white shadow-mid transition hover:scale-110"
          >
            <Pencil size={15} />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary-tint px-3 py-1 text-xs font-bold text-secondary-dark">
              <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" /> Đang hoạt động
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="text-2xl">{child.name}</h2>
            <span className="text-sm font-bold text-navy/60">
              ({ageLabel(child)}
              {child.birthDate && ` • ${formatBirthDate(child.birthDate)}`})
            </span>
          </div>
          {child.character?.appearance && <p className="mt-0.5 line-clamp-2 text-sm text-navy/60">{child.character.appearance}</p>}
          <TodayUsage childId={child.id} />
        </div>

        <div className="flex gap-2 sm:flex-col">
          <div className="flex w-24 flex-col items-center rounded-2xl bg-secondary-tint p-3 text-center">
            <span className="font-display text-xl font-bold text-secondary-dark">{child.completedSessionsCount}</span>
            <span className="mt-1 text-xs leading-tight text-navy/60">Truyện đã hoàn thành</span>
          </div>
          <button
            onClick={onDelete}
            className="inline-flex items-center justify-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-navy/50 transition hover:bg-danger-tint hover:text-danger"
          >
            <Trash2 size={14} /> Xóa hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
}

// Thẻ nhỏ của các bé khác — bấm để chuyển hồ sơ
export function OtherChildCard({ child, onSelect }) {
  return (
    <div className="flex flex-col justify-between rounded-card bg-surface/80 p-5 shadow-low transition hover:bg-white hover:shadow-mid">
      <div className="flex items-center gap-4">
        <Avatar child={child} className="h-20 w-20 shrink-0 bg-secondary-tint text-4xl" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg">{child.name}</h3>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-navy/60">{ageLabel(child)}</span>
          </div>
          {child.birthDate && <p className="text-xs text-navy/60">Sinh ngày {formatBirthDate(child.birthDate)}</p>}
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1 text-secondary-dark">
              <BookOpen size={15} /> {child.booksCount} truyện trong tủ
            </span>
            <span className="flex items-center gap-1 text-primary-dark">
              <Timer size={15} /> {child.dailyScreenTimeMinutes} phút/ngày
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-navy/60">
          <CheckCircle2 size={15} className="text-secondary" /> Hồ sơ đã đồng bộ
        </span>
        <button
          onClick={onSelect}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-low transition hover:bg-secondary hover:text-white"
        >
          <ArrowLeftRight size={16} /> Chọn bé này
        </button>
      </div>
    </div>
  );
}

export function AddChildCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex h-full min-h-40 flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-outline bg-surface/60 p-5 text-navy/60 transition hover:border-primary hover:bg-primary-tint hover:text-primary-dark"
    >
      <Plus size={28} />
      <span className="font-bold">Thêm hồ sơ bé mới</span>
      <span className="text-xs">Mỗi bé có mục tiêu EQ và thế giới truyện riêng</span>
    </button>
  );
}
