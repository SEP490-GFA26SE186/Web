import { Link } from "react-router-dom";
import { Bot, BookOpen, Flag, IdCard, Loader2, Lock } from "lucide-react";
import CaselTag from "../../components/parent/library/CaselTag";
import { REVIEW_TYPES } from "../../constants/moderation";
import { ROUTES } from "../../constants/routes";
import { useSpecialistOverview, useReviewQueue } from "../../hooks/useSpecialist";
import { formatNumber } from "../../utils/format";

const since = (iso) => {
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  return h < 1 ? "vừa gửi" : h < 24 ? `${h} giờ trước` : `${Math.floor(h / 24)} ngày trước`;
};

// Tổng quan kiểm duyệt: hàng đợi (nộp bán + hậu kiểm báo cáo + kiểm tra ngẫu nhiên, cũ nhất trước),
// số hồ sơ người bán và báo cáo vi phạm đang chờ.
function SpecialistDashboardPage() {
  const { data: overview } = useSpecialistOverview();
  const { data: queue = [], isLoading, error } = useReviewQueue();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Tổng quan kiểm duyệt</h1>
        <p className="mt-1 text-navy/70">Hàng chờ gồm truyện nộp bán, hậu kiểm báo cáo và kiểm tra ngẫu nhiên — cũ nhất lên trước.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4 p-5">
          <BookOpen size={28} className="text-primary" />
          <div>
            <p className="text-sm text-navy/60">Truyện chờ duyệt</p>
            <p className="font-display text-2xl font-bold">{overview?.navBadges.storyQueue ?? "—"}</p>
          </div>
        </div>
        <Link to={ROUTES.SPECIALIST.SELLER_APPLICATIONS} className="card flex items-center gap-4 p-5 transition hover:shadow-mid">
          <IdCard size={28} className="text-secondary-dark" />
          <div>
            <p className="text-sm text-navy/60">Hồ sơ người bán chờ duyệt</p>
            <p className="font-display text-2xl font-bold">{overview?.navBadges.sellerApplications ?? "—"}</p>
          </div>
        </Link>
        <Link to={ROUTES.SPECIALIST.REPORTS} className="card flex items-center gap-4 p-5 transition hover:shadow-mid">
          <Flag size={28} className="text-danger" />
          <div>
            <p className="text-sm text-navy/60">Báo cáo vi phạm đang mở</p>
            <p className="font-display text-2xl font-bold">{overview?.navBadges.reports ?? "—"}</p>
          </div>
        </Link>
      </div>

      <section className="card p-5">
        <h2 className="mb-4 text-xl">Hàng chờ duyệt truyện</h2>
        {isLoading && <Loader2 size={28} className="animate-spin text-primary" />}
        {error && <p className="text-danger">{error.message}</p>}
        {!isLoading && !error && queue.length === 0 && <p className="text-navy/60">Không có truyện nào đang chờ duyệt ✨</p>}
        <ul className="divide-y divide-outline">
          {queue.map((q) => (
            <li key={q.reviewId}>
              <Link to={ROUTES.SPECIALIST.workspace(q.reviewId)} className="-mx-2 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl px-2 py-3 hover:bg-surface">
                <div className="min-w-0 basis-full sm:basis-0 sm:flex-1">
                  <p className="truncate font-bold">{q.title}</p>
                  <p className="text-sm text-navy/60">
                    {q.seller} • {q.pageCount} trang • {q.priceVnd ? `${formatNumber(q.priceVnd)}đ` : "Miễn phí"} •{" "}
                    {since(q.reviewType === "submission" ? q.submittedAt : q.createdAt)}
                  </p>
                </div>
                {q.hasNarration && q.narration && !q.narration.complete && (
                  <span className="rounded-full bg-primary-tint px-2 py-0.5 text-xs font-bold text-primary-dark" title="Chỉ nhận duyệt khi giọng đọc tạo xong">
                    Đang tạo giọng đọc {q.narration.ready}/{q.narration.total}
                  </span>
                )}
                {q.reviewType !== "submission" && (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${REVIEW_TYPES[q.reviewType]?.tone}`}>
                    {REVIEW_TYPES[q.reviewType]?.label}
                    {q.openReports > 0 && ` • ${q.openReports} báo cáo`}
                  </span>
                )}
                <CaselTag competency={q.competency} className="bg-secondary-tint" short />
                {q.hasAiContent && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-navy-tint px-2 py-0.5 text-xs font-bold">
                    <Bot size={12} /> AI
                  </span>
                )}
                {q.claimedBy && (
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${q.claimedBy.mine ? "bg-primary-tint text-primary-dark" : "bg-danger-tint text-danger"}`}>
                    <Lock size={12} /> {q.claimedBy.mine ? "Bạn đang duyệt" : `${q.claimedBy.name} đang duyệt`}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default SpecialistDashboardPage;
