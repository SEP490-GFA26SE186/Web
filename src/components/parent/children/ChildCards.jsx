import { ArrowLeftRight, CheckCircle2, Compass, Pencil, Plus, Sprout } from "lucide-react";

const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString("vi-VN") : "");

function Avatar({ child, className }) {
  return (
    <div className={`grid place-items-center rounded-3xl p-1 shadow-inner ${className}`}>
      <span className="grid h-full w-full place-items-center rounded-2xl bg-white/60 select-none">{child.avatarEmoji}</span>
    </div>
  );
}

// Thẻ lớn của bé đang được chọn
export function ActiveChildCard({ child, onEdit }) {
  const xpPercent = Math.min(100, Math.round((child.xp / child.xpNext) * 100));

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
            <span className="rounded-full bg-primary-tint px-3 py-1 text-xs font-bold text-primary-dark">
              ⭐ {child.loveStars} Sao Yêu Thương
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="text-2xl">{child.name}</h2>
            <span className="text-sm font-bold text-navy/60">
              ({child.age} tuổi • {formatDate(child.birthday)})
            </span>
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
            <Compass size={17} /> {child.levelTitle} • Cấp {child.level}
          </p>
          <div className="mt-3 flex w-full max-w-sm items-center gap-3 rounded-full bg-surface px-3 py-1.5">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-outline">
              <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${xpPercent}%` }} />
            </div>
            <span className="shrink-0 text-xs font-bold text-navy/60">
              {child.xp} / {child.xpNext} XP
            </span>
          </div>
        </div>

        <div className="hidden w-24 flex-col items-center rounded-2xl bg-secondary-tint p-3 text-center xl:flex">
          <span className="font-display text-xl font-bold text-secondary-dark">{child.storiesHeard}</span>
          <span className="mt-1 text-xs leading-tight text-navy/60">Truyện đã nghe</span>
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
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-navy/60">{child.age} tuổi</span>
          </div>
          <p className="text-xs text-navy/60">Sinh ngày {formatDate(child.birthday)}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="flex items-center gap-1 text-secondary-dark">
              <Sprout size={15} /> {child.levelTitle} • Cấp {child.level}
            </span>
            <span className="text-primary-dark">⭐ {child.loveStars} Sao</span>
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
