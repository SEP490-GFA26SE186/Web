import { ChevronRight, ClipboardCheck, Hourglass, Library, Timer, TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import ContinueReadingCard from "../../components/parent/ContinueReadingCard";
import DraftReviewCard from "../../components/parent/DraftReviewCard";
import EqRadarCard from "../../components/parent/EqRadarCard";
import ListingCard from "../../components/parent/marketplace/ListingCard";
import NoChildState from "../../components/parent/NoChildState";
import StatCard from "../../components/parent/StatCard";
import { ROUTES } from "../../constants/routes";
import { useChildBookshelf, useChildOverview, useChildUsage, useSelectedChild } from "../../hooks/useChildProfile";
import { useListings } from "../../hooks/useMarketplace";
import { usePendingDrafts, useParentProfile } from "../../hooks/useParent";
import { toast } from "../../stores/toastStore";
import { childEmoji, vnDateOffset } from "../../utils/child";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 11) return "Chào buổi sáng";
  if (h < 14) return "Chào buổi trưa";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
};

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-16 w-2/3 rounded-2xl bg-surface" />
      <div className="h-72 rounded-stage bg-surface" />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-card bg-surface" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="h-[520px] rounded-card bg-surface xl:col-span-7" />
        <div className="h-[520px] rounded-card bg-surface xl:col-span-5" />
      </div>
    </div>
  );
}

function ParentDashboardPage() {
  const { child, isEmpty } = useSelectedChild();
  const parent = useParentProfile();
  const overview = useChildOverview(child?.id);
  const yesterday = useChildUsage(child?.id, vnDateOffset(-1));
  const bookshelf = useChildBookshelf(child?.id, { limit: 1 });
  const drafts = usePendingDrafts();
  const featured = useListings({ sort: "best_selling", limit: 3 });

  if (isEmpty) return <NoChildState />;
  if (overview.isLoading || !child) return <DashboardSkeleton />;

  if (overview.isError) {
    return (
      <div className="card mx-auto mt-20 max-w-md p-8 text-center">
        <p className="font-display text-lg font-bold">Ôi, có lỗi xảy ra rồi 😢</p>
        <button onClick={() => overview.refetch()} className="btn-primary mt-4">
          Thử lại
        </button>
      </div>
    );
  }

  const { todayUsage, readingStats, eqReport } = overview.data;
  const usageDelta = yesterday.data ? todayUsage.usedMinutes - yesterday.data.usedMinutes : null;
  const continueReading = bookshelf.data?.continueReading[0];
  const pendingDrafts = drafts.data ?? [];

  return (
    <div className="space-y-8">
      {/* Lời chào */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-[34px]">
            {getGreeting()}, {parent.name}! 👋
          </h1>
          <p className="mt-2 text-navy/70">
            Hôm nay {child.name} đã đọc <span className="font-bold text-primary">{todayUsage.usedMinutes} phút</span>
            {todayUsage.isLimitReached
              ? " — đã chạm giới hạn thời gian trong ngày."
              : `, còn ${todayUsage.remainingMinutes} phút trong giới hạn hôm nay.`}
          </p>
        </div>
        <div className="hidden items-center gap-3 rounded-full border border-outline bg-white py-2 pr-5 pl-2 shadow-low md:flex">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary-tint text-xl">{childEmoji(child)}</span>
          <div className="leading-tight">
            <p className="text-sm font-bold">
              {child.name}
              {child.age != null && ` • ${child.age} tuổi`}
            </p>
            <p className="text-xs text-secondary-dark">📚 {readingStats.booksInBookshelf} truyện trên giá sách</p>
          </div>
        </div>
      </div>

      {continueReading && <ContinueReadingCard story={continueReading} />}

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Timer}
          tone="orange"
          label="Thời gian đọc hôm nay"
          value={`${todayUsage.usedMinutes} phút`}
          hint={
            usageDelta == null ? null : (
              <span className="inline-flex items-center gap-1">
                {usageDelta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {usageDelta >= 0 ? "+" : ""}
                {usageDelta}m so với hôm qua
              </span>
            )
          }
        />
        <StatCard
          icon={Hourglass}
          tone="teal"
          label="Còn lại hôm nay"
          value={`${todayUsage.remainingMinutes} phút`}
          hint={`Giới hạn ${todayUsage.dailyLimitMinutes} phút/ngày`}
          hintClassName="text-navy/60"
        />
        <StatCard
          icon={Library}
          tone="navy"
          label="Truyện đã đọc xong"
          value={`${readingStats.completedStories} truyện`}
          hint={`${readingStats.booksInBookshelf} truyện trên giá sách`}
          hintClassName="text-navy/60"
        />
        <StatCard
          icon={ClipboardCheck}
          tone="orange"
          label="Truyện chờ xem lại"
          value={`${pendingDrafts.length} truyện`}
          hint={pendingDrafts.length ? "Xem lại xong mới đưa lên giá sách ✨" : "Đã xem lại hết 🎉"}
          hintClassName="text-primary-dark"
        />
      </div>

      {/* EQ + Truyện chờ xem lại */}
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <EqRadarCard childName={child.name} skills={eqReport.skills} />
        </div>
        <div className="flex flex-col gap-4 xl:col-span-5">
          <DraftReviewCard draft={pendingDrafts[0]} moreCount={Math.max(0, pendingDrafts.length - 1)} />
        </div>
      </div>

      {/* Nổi bật trên chợ truyện */}
      {featured.data?.items.length > 0 && (
        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl">Bán chạy trên Chợ truyện</h2>
              <p className="mt-1 text-sm text-navy/60">Truyện từ các gia đình khác, đã được Moderator duyệt từng trang</p>
            </div>
            <Link to={ROUTES.PARENT.MARKETPLACE} className="inline-flex items-center gap-1 text-sm font-bold text-primary-dark hover:text-primary">
              Xem chợ truyện <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {featured.data.items.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onAddToCart={(l) => toast.info(`Giỏ hàng đang được hoàn thiện — "${l.title}"`)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ParentDashboardPage;
