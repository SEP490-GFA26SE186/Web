import { AlertCircle, AudioLines, BookOpen, Bot, CheckCircle2, Flag, IdCard, Lock } from "lucide-react";
import CaselTag from "../../components/parent/library/CaselTag";
import { Badge, Card, CardHeader, EmptyState, ListRow, PageHeader, Skeleton, StatTile } from "../../components/ui";
import { REVIEW_TYPES } from "../../constants/moderation";
import { ROUTES } from "../../constants/routes";
import { useSpecialistOverview, useReviewQueue } from "../../hooks/useSpecialist";
import { formatListingPrice } from "../../utils/format";

const since = (iso) => {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  return h < 1 ? "vừa gửi" : h < 24 ? `${h} giờ trước` : `${Math.floor(h / 24)} ngày trước`;
};

function QueueRow({ q }) {
  const type = REVIEW_TYPES[q.reviewType];
  return (
    <ListRow
      to={ROUTES.SPECIALIST.workspace(q.reviewId)}
      icon={BookOpen}
      iconTone={q.reviewType === "report_followup" ? "bg-danger-tint text-danger" : "bg-navy-tint text-navy-soft"}
    >
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-navy">{q.title}</p>
          <p className="truncate text-[13px] text-navy/55">
            {q.seller}, {q.pageCount} trang, {formatListingPrice(q.priceVnd)}
            <span className="text-navy/40"> · {since(q.reviewType === "submission" ? q.submittedAt : q.createdAt)}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
          {q.hasNarration && q.narration && !q.narration.complete && (
            <Badge tone="primary" icon={AudioLines} title="Chỉ nhận duyệt khi giọng đọc tạo xong">
              Giọng đọc {q.narration.ready}/{q.narration.total}
            </Badge>
          )}
          {q.reviewType !== "submission" && type && (
            <Badge tone={type.tone}>
              {type.label}
              {q.openReports > 0 && `, ${q.openReports} báo cáo`}
            </Badge>
          )}
          <CaselTag competency={q.competency} className="bg-secondary-tint" short />
          {q.hasAiContent && (
            <Badge tone="navy" icon={Bot}>
              AI
            </Badge>
          )}
          {q.claimedBy && (
            <Badge tone={q.claimedBy.mine ? "primary" : "danger"} icon={Lock}>
              {q.claimedBy.mine ? "Bạn đang duyệt" : `${q.claimedBy.name} đang duyệt`}
            </Badge>
          )}
        </div>
      </div>
    </ListRow>
  );
}

// Tổng quan kiểm duyệt: hàng đợi (nộp bán + hậu kiểm báo cáo + kiểm tra ngẫu nhiên, cũ nhất trước),
// số hồ sơ người bán và báo cáo vi phạm đang chờ.
function SpecialistDashboardPage() {
  const { data: overview, isLoading: overviewLoading } = useSpecialistOverview();
  const { data: queue = [], isLoading, error } = useReviewQueue();
  const badges = overview?.navBadges;

  return (
    <div className="space-y-6">
      <PageHeader title="Tổng quan kiểm duyệt" description="Hàng chờ gồm truyện nộp bán, hậu kiểm báo cáo và kiểm tra ngẫu nhiên. Cũ nhất lên trước." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile index={0} icon={BookOpen} tone="primary" label="Truyện chờ duyệt" value={badges?.storyQueue ?? 0} loading={overviewLoading} />
        <StatTile
          index={1}
          icon={IdCard}
          tone="secondary"
          label="Hồ sơ người bán chờ duyệt"
          value={badges?.sellerApplications ?? 0}
          loading={overviewLoading}
          to={ROUTES.SPECIALIST.SELLER_APPLICATIONS}
        />
        <StatTile
          index={2}
          icon={Flag}
          tone="danger"
          label="Báo cáo vi phạm đang mở"
          value={badges?.reports ?? 0}
          loading={overviewLoading}
          to={ROUTES.SPECIALIST.REPORTS}
        />
      </div>

      <Card reveal index={3}>
        <CardHeader
          title="Hàng chờ duyệt truyện"
          description="Bấm vào truyện để nhận duyệt. Truyện đang có người duyệt sẽ được khoá."
          action={queue.length > 0 && <Badge tone="primary">{queue.length} truyện</Badge>}
          className="mb-3"
        />
        {isLoading && (
          <div className="space-y-2 pt-1" aria-busy="true">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <Skeleton className="h-9 w-9 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}
        {error && <EmptyState compact icon={AlertCircle} tone="danger" title="Không tải được hàng chờ" description={error.message} />}
        {!isLoading && !error && queue.length === 0 && (
          <EmptyState icon={CheckCircle2} tone="secondary" title="Hàng chờ trống" description="Không có truyện nào đang chờ duyệt. Truyện mới nộp sẽ hiện ở đây." />
        )}
        {queue.length > 0 && (
          <ul className="divide-y divide-navy/[0.05]">
            {queue.map((q) => (
              <li key={q.reviewId} className="py-0.5">
                <QueueRow q={q} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export default SpecialistDashboardPage;
