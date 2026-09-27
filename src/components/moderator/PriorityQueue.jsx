import { ArrowRight, Brain, ChevronDown, ChevronRight, Loader2, PenLine, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { formatAgo, formatDuration } from "../../utils/format";

const AGE_OPTIONS = [
  { value: "all", label: "Mọi độ tuổi" },
  { value: "3-5", label: "3-5 tuổi" },
  { value: "4-6", label: "4-6 tuổi" },
  { value: "5-7", label: "5-7 tuổi" },
  { value: "6-8", label: "6-8 tuổi" },
  { value: "7-9", label: "7-9 tuổi" },
];

// Còn ≤ 2h30 so với hạn SLA → tô đỏ để ưu tiên
const isUrgent = (q) => q.slaMinutes - q.submittedMinutesAgo <= 150;

function QueueRow({ item }) {
  return (
    <div className="grid grid-cols-12 items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-low transition hover:bg-canvas">
      <div className="col-span-4 flex min-w-0 items-center gap-3">
        <span className={`grid h-14 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-2xl shadow-low ${item.coverGradient}`}>
          {item.coverEmoji}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate font-display font-bold">{item.title}</span>
            {item.interactive && (
              <span title="Có lựa chọn tương tác">
                <Zap size={14} className="shrink-0 fill-primary text-primary" />
              </span>
            )}
            {item.resubmission > 0 && (
              <span className="shrink-0 rounded bg-danger-tint px-1.5 text-[10px] font-bold text-danger-dark uppercase">
                Lần {item.resubmission}
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-navy/60">
            <b className="text-navy">{item.author}</b> •{" "}
            <span className={item.firstStory ? "text-navy/60" : "text-xs font-bold text-secondary-dark"}>{item.authorStat}</span>
          </p>
        </div>
      </div>

      <div className="col-span-3 flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-1">
          {item.caselSkill ? (
            <span className="rounded-full bg-secondary-tint px-2 py-0.5 text-xs font-bold text-secondary-dark">{item.caselSkill}</span>
          ) : (
            <span className="rounded-full bg-primary-tint px-2 py-0.5 text-xs font-bold text-primary-dark">Chưa gắn thẻ CASEL</span>
          )}
          <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-bold text-navy/60">{item.ageRange}</span>
        </div>
        <span className="truncate text-sm text-navy/60">{item.focus}</span>
      </div>

      <div className="col-span-2">
        {item.aiAssist == null ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary-tint px-2 py-0.5 text-xs font-bold text-secondary-dark">
            <PenLine size={13} /> Tự viết 100%
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-xs font-bold text-navy/70">
            <Brain size={13} /> AI Hỗ trợ {item.aiAssist}%
          </span>
        )}
        <span className="mt-0.5 block text-[11px] text-navy/50">{item.aiNote}</span>
      </div>

      <div className="col-span-1">
        <span className={`text-xs font-bold ${isUrgent(item) ? "text-danger" : "text-navy"}`}>{formatAgo(item.submittedMinutesAgo)}</span>
        <span className="block text-[10px] text-navy/50">SLA: {formatDuration(item.slaMinutes)}</span>
      </div>

      <div className="col-span-2 flex justify-end">
        <Link
          to={ROUTES.MODERATOR.workspace(item.id)}
          className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-sm font-bold text-white shadow-low transition hover:bg-primary-dark"
        >
          Duyệt ngay <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

function PriorityQueue({ data, isLoading, isFetching, filters, onFiltersChange, limit = 4 }) {
  const items = data?.items ?? [];

  return (
    <section className="flex flex-col gap-4 rounded-stage bg-surface p-6 shadow-low">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Star size={22} className="fill-primary text-primary" />
            <h2 className="text-2xl">Hàng chờ duyệt truyện ưu tiên</h2>
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">{items.length} tác phẩm</span>
            {isFetching && !isLoading && <Loader2 size={16} className="animate-spin text-primary" />}
          </div>
          <p className="mt-0.5 text-sm text-navy/60">Ưu tiên theo thời hạn cam kết SLA và xếp hạng tín nhiệm tác giả</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label className="relative">
            <span className="sr-only">Lọc theo độ tuổi</span>
            <select
              value={filters.age}
              onChange={(e) => onFiltersChange({ ...filters, age: e.target.value })}
              className="cursor-pointer appearance-none rounded-full bg-outline/70 py-1.5 pr-8 pl-3 text-xs font-bold outline-none hover:bg-outline"
            >
              {AGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.value === "all" ? "Lọc theo độ tuổi" : o.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2" />
          </label>
          <button
            onClick={() => onFiltersChange({ ...filters, caselTaggedOnly: !filters.caselTaggedOnly })}
            aria-pressed={filters.caselTaggedOnly}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              filters.caselTaggedOnly ? "bg-secondary-tint text-secondary-dark ring-1 ring-secondary/30" : "bg-outline/70 hover:bg-outline"
            }`}
          >
            CASEL đã gắn thẻ
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className={`flex min-w-[860px] flex-col gap-2 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
          <div className="grid grid-cols-12 gap-3 rounded-2xl bg-outline/60 px-4 py-2 text-[11px] font-bold tracking-wider text-navy/60 uppercase">
            <div className="col-span-4">Truyện & Tác giả</div>
            <div className="col-span-3">Năng lực CASEL & Tuổi</div>
            <div className="col-span-2">Mức độ AI</div>
            <div className="col-span-1">Thời gian</div>
            <div className="col-span-2 text-right">Thao tác</div>
          </div>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-2xl bg-white" />)
            : items.slice(0, limit).map((item) => <QueueRow key={item.id} item={item} />)}
          {!isLoading && items.length === 0 && (
            <p className="rounded-2xl bg-white p-6 text-center text-sm text-navy/60">Không có truyện nào khớp bộ lọc 🎉</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-navy/60">
        <span>
          Hiển thị {Math.min(limit, items.length)} trong {data?.total ?? "…"} truyện đang chờ duyệt
        </span>
        <Link to={ROUTES.MODERATOR.QUEUE} className="flex items-center gap-1 font-bold text-primary-dark hover:text-primary">
          Xem toàn bộ {data?.total ?? ""} truyện trong hàng đợi <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export default PriorityQueue;
