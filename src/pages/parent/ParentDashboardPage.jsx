import { AlertCircle, ArrowRight, ClipboardCheck, Hourglass, Library, RotateCw, Timer } from "lucide-react";
import ContinueReadingCard from "../../components/parent/ContinueReadingCard";
import DraftReviewCard from "../../components/parent/DraftReviewCard";
import EqRadarCard from "../../components/parent/EqRadarCard";
import ListingCard from "../../components/parent/marketplace/ListingCard";
import NoChildState from "../../components/parent/NoChildState";
import { Button, Card, EmptyState, Skeleton, StatTile } from "../../components/ui";
import { ROUTES } from "../../constants/routes";
import { useChildBookshelf, useChildOverview, useChildUsage, useSelectedChild } from "../../hooks/useChildProfile";
import { useListings } from "../../hooks/useMarketplace";
import { usePendingDrafts, useParentProfile } from "../../hooks/useParent";
import { vnDateOffset } from "../../utils/child";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 11) return "Chào buổi sáng";
  if (h < 14) return "Chào buổi trưa";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="space-y-2">
        <Skeleton className="h-9 w-80 max-w-full" />
        <Skeleton className="h-5 w-64 max-w-full" />
      </div>
      <Skeleton className="h-64 rounded-stage" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[132px] rounded-card" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-12">
        <Skeleton className="h-[520px] rounded-card xl:col-span-7" />
        <Skeleton className="h-[520px] rounded-card xl:col-span-5" />
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
      <Card className="mx-auto mt-16 max-w-md">
        <EmptyState
          icon={AlertCircle}
          tone="danger"
          title="Không tải được tổng quan"
          description="Kết nối có thể đang chập chờn. Ba mẹ thử tải lại nhé."
          action={
            <Button icon={RotateCw} onClick={() => overview.refetch()}>
              Thử lại
            </Button>
          }
        />
      </Card>
    );
  }

  const { todayUsage, readingStats, eqReport } = overview.data;
  const usageDelta = yesterday.data ? todayUsage.usedMinutes - yesterday.data.usedMinutes : null;
  const continueReading = bookshelf.data?.continueReading[0];
  const pendingDrafts = drafts.data ?? [];

  return (
    <div className="space-y-8">
      {/* Lời chào */}
      <header className="animate-rise">
        <h1 className="text-2xl leading-tight tracking-tight md:text-[32px]">
          {getGreeting()}, {parent.name}
        </h1>
        <p className="mt-2 text-[15px] text-navy/60">
          {todayUsage.sessionsCount ? (
            <>
              Hôm nay {child.name} đã đọc <span className="font-bold text-primary-dark">{todayUsage.usedMinutes} phút</span> qua {todayUsage.sessionsCount} lượt đọc.
            </>
          ) : (
            `Hôm nay ${child.name} chưa đọc truyện nào.`
          )}
        </p>
      </header>

      {continueReading && <ContinueReadingCard story={continueReading} />}

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatTile
          index={0}
          icon={Timer}
          tone="primary"
          label="Thời gian đọc hôm nay"
          value={`${todayUsage.usedMinutes} phút`}
          trend={usageDelta}
          trendLabel={usageDelta == null ? null : "phút so với hôm qua"}
        />
        <StatTile
          index={1}
          icon={Hourglass}
          tone="secondary"
          label="Lượt đọc hôm nay"
          value={`${todayUsage.sessionsCount} lượt`}
          hint={`${todayUsage.completedCount} lượt đọc hết truyện`}
        />
        <StatTile
          index={2}
          icon={Library}
          tone="navy"
          label="Truyện đã đọc xong"
          value={`${readingStats.completedStories} truyện`}
          hint={`${readingStats.booksInBookshelf} truyện trên giá sách`}
          to={ROUTES.PARENT.LIBRARY}
        />
        <StatTile
          index={3}
          icon={ClipboardCheck}
          tone="primary"
          label="Truyện chờ xem lại"
          value={`${pendingDrafts.length} truyện`}
          hint={pendingDrafts.length ? "Xem lại xong mới lên giá sách" : "Đã xem lại hết"}
          to={ROUTES.PARENT.STUDIO}
        />
      </div>

      {/* EQ + Truyện chờ xem lại */}
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <EqRadarCard childName={child.name} report={eqReport} />
        </div>
        <div className="flex flex-col xl:col-span-5 xl:self-start">
          <DraftReviewCard draft={pendingDrafts[0]} moreCount={Math.max(0, pendingDrafts.length - 1)} />
        </div>
      </div>

      {/* Nổi bật trên chợ truyện */}
      {featured.data?.items.length > 0 && (
        <section className="animate-rise">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl">Bán chạy trên Chợ truyện</h2>
              <p className="mt-1 text-sm text-navy/60">Truyện từ các gia đình khác, đã được chuyên gia duyệt từng trang</p>
            </div>
            <Button variant="ghost" size="sm" to={ROUTES.PARENT.MARKETPLACE} iconRight={ArrowRight} className="text-primary-dark hover:text-primary-dark">
              Xem chợ truyện
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {featured.data.items.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ParentDashboardPage;
