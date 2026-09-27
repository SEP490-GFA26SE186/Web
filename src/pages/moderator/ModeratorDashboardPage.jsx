import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee, FastForward, Play } from "lucide-react";
import PriorityQueue from "../../components/moderator/PriorityQueue";
import ReportsPanel from "../../components/moderator/ReportsPanel";
import ShiftBanner from "../../components/moderator/ShiftBanner";
import { AiFlagsCard, GuardianPrinciplesCard, WeeklyAuditCard } from "../../components/moderator/SideWidgets";
import SummaryCards from "../../components/moderator/SummaryCards";
import { ROUTES } from "../../constants/routes";
import { useModeratorDashboard, useModeratorOverview, useReviewQueue } from "../../hooks/useModerator";
import { toast } from "../../stores/toastStore";

const BREAK_SECONDS = 15 * 60;

// Thanh nổi cuối trang: số truyện còn lại, nghỉ giữa ca, duyệt truyện kế tiếp
function QueueFooterBar({ remaining, avgSla, onNext, canNext }) {
  const [breakLeft, setBreakLeft] = useState(0);

  useEffect(() => {
    if (!breakLeft) return;
    const t = setTimeout(() => {
      if (breakLeft === 1) toast.info("Hết giờ nghỉ giữa ca — quay lại hàng chờ thôi!");
      setBreakLeft((s) => s - 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [breakLeft]);

  const onBreak = breakLeft > 0;
  const mm = String(Math.floor(breakLeft / 60)).padStart(2, "0");
  const ss = String(breakLeft % 60).padStart(2, "0");

  return (
    <aside className="sticky bottom-4 z-10 mx-auto flex w-full max-w-4xl items-center justify-between gap-4 rounded-full bg-navy/95 px-5 py-3 text-white shadow-high backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex items-center gap-2 truncate text-sm font-bold">
          <span className={`h-2.5 w-2.5 rounded-full ${onBreak ? "bg-amber-400" : "animate-ping bg-secondary"}`} />
          {onBreak ? `Đang nghỉ giữa ca • ${mm}:${ss}` : `Hàng chờ còn ${remaining} truyện`}
        </span>
        <span className="hidden text-white/40 sm:inline">•</span>
        <span className="hidden truncate text-sm text-white/75 sm:inline">
          SLA trung bình ca hôm nay: <b className="text-teal-300">{avgSla}</b>
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => setBreakLeft(onBreak ? 0 : BREAK_SECONDS)}
          className="hidden items-center gap-1 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold transition hover:bg-white/25 md:inline-flex"
        >
          {onBreak ? <Play size={15} /> : <Coffee size={15} />}
          {onBreak ? "Quay lại ca trực" : "Nghỉ giữa ca (15p)"}
        </button>
        <button
          onClick={onNext}
          disabled={onBreak || !canNext}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-1.5 text-sm font-bold shadow-mid transition hover:bg-primary-dark disabled:opacity-50"
        >
          <FastForward size={17} /> Tiếp tục duyệt truyện kế tiếp
        </button>
      </div>
    </aside>
  );
}

function ModeratorDashboardPage() {
  const navigate = useNavigate();
  const [queueFilters, setQueueFilters] = useState({ age: "all", caselTaggedOnly: false });
  const { data: overview } = useModeratorOverview();
  const { data, isLoading } = useModeratorDashboard();
  const queue = useReviewQueue(queueFilters);
  const allQueue = useReviewQueue();

  const nextStory = allQueue.data?.items[0];
  const goNext = () => nextStory && navigate(ROUTES.MODERATOR.workspace(nextStory.id));

  if (isLoading || !data || !overview) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-44 rounded-stage bg-surface" />
        <div className="grid grid-cols-2 gap-4 2xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 rounded-card bg-surface" />
          ))}
        </div>
        <div className="h-96 rounded-stage bg-surface" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ShiftBanner shift={overview.shift} onStart={goNext} canStart={!!nextStory} />
      <SummaryCards summary={data.summary} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          <PriorityQueue
            data={queue.data}
            isLoading={queue.isLoading}
            isFetching={queue.isFetching}
            filters={queueFilters}
            onFiltersChange={setQueueFilters}
          />
          <ReportsPanel reports={data.reports} />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-4">
          <WeeklyAuditCard audit={data.weeklyAudit} />
          <AiFlagsCard flags={data.aiFlags} />
          <GuardianPrinciplesCard />
        </div>
      </div>

      <QueueFooterBar
        remaining={allQueue.data?.total ?? data.summary.storyQueue.count}
        avgSla={overview.shift.avgSla}
        onNext={goNext}
        canNext={!!nextStory}
      />
    </div>
  );
}

export default ModeratorDashboardPage;
