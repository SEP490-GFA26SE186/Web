import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Flag, Loader2, PauseCircle, PenLine, X } from "lucide-react";
import StrikeModal from "../../components/specialist/StrikeModal";
import { LISTING_STATUS, REPORT_CATEGORIES, REPORT_STATUS, REVIEW_TYPES, formatDateTime } from "../../constants/moderation";
import { ROUTES } from "../../constants/routes";
import { useDismissReport, useHideReview, useReportGroups, useSuspendListing } from "../../hooks/useSpecialist";
import { toast } from "../../stores/toastStore";

const TABS = [
  { value: "open", label: "Đang mở" },
  { value: "resolved", label: "Vi phạm" },
  { value: "dismissed", label: "Đã bác" },
  { value: "all", label: "Tất cả" },
];

/** Tạm gỡ truyện đang bán (kèm lý do) → BE tạo lượt hậu kiểm. */
function SuspendForm({ listingId, onDone }) {
  const [reason, setReason] = useState("");
  const suspend = useSuspendListing();
  const submit = (e) => {
    e.preventDefault();
    suspend.mutate(
      { listingId, reason },
      { onSuccess: () => { toast.success("Đã tạm gỡ — truyện vào hàng chờ hậu kiểm"); onDone(); }, onError: (err) => toast.error(err.message) },
    );
  };
  return (
    <form onSubmit={submit} className="flex flex-wrap gap-2">
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        minLength={5}
        required
        placeholder="Lý do tạm gỡ"
        aria-label="Lý do tạm gỡ"
        className="min-w-56 flex-1 rounded-full border-[1.5px] border-outline px-4 py-2 text-sm"
      />
      <button type="submit" disabled={suspend.isPending} className="inline-flex items-center gap-1.5 rounded-full bg-danger px-4 py-2 text-sm font-bold text-white disabled:opacity-70">
        {suspend.isPending ? <Loader2 size={15} className="animate-spin" /> : <PauseCircle size={15} />} Tạm gỡ
      </button>
      <button type="button" onClick={onDone} className="rounded-full p-2 text-navy/60 hover:bg-surface" aria-label="Đóng">
        <X size={16} />
      </button>
    </form>
  );
}

function ReportGroup({ group, onStrike }) {
  const [suspending, setSuspending] = useState(false);
  const dismiss = useDismissReport();
  const hide = useHideReview();
  const { listing, openReview, reports } = group;
  const status = LISTING_STATUS[listing.status];
  const openCount = reports.filter((r) => r.status === "open").length;

  return (
    <li className="card space-y-3 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg">{listing.title}</h2>
            {status && <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${status.tone}`}>{status.label}</span>}
          </div>
          <p className="text-sm text-navy/60">
            Người bán: {listing.seller} • {reports.length} báo cáo{openCount ? ` (${openCount} đang mở)` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {openReview && (
            <Link to={ROUTES.SPECIALIST.workspace(openReview.id)} className="btn-primary px-4 py-2 text-sm">
              <PenLine size={15} /> {REVIEW_TYPES[openReview.reviewType]?.label}: xem lại truyện
            </Link>
          )}
          {/* Đang có lượt kiểm tra ngẫu nhiên mở vẫn tạm gỡ được: BE đổi lượt đó thành hậu kiểm báo cáo */}
          {listing.status === "published" && !suspending && (
            <button type="button" onClick={() => setSuspending(true)} className="btn-ghost px-4 py-2 text-sm text-danger">
              <PauseCircle size={15} /> Tạm gỡ & hậu kiểm
            </button>
          )}
          <button type="button" onClick={() => onStrike({ id: listing.sellerId, displayName: listing.seller }, reports[0]?.id)} className="btn-ghost px-4 py-2 text-sm">
            <AlertTriangle size={15} /> Cảnh cáo
          </button>
        </div>
      </div>
      {suspending && <SuspendForm listingId={listing.id} onDone={() => setSuspending(false)} />}

      <ul className="divide-y divide-outline rounded-card bg-surface px-4">
        {reports.map((r) => {
          const st = REPORT_STATUS[r.status];
          return (
            <li key={r.id} className="flex flex-wrap items-start gap-3 py-3 text-sm">
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="font-bold">
                  {REPORT_CATEGORIES[r.category] ?? r.category}
                  {r.pageOrder && <span className="font-normal text-navy/60"> • trang {r.pageOrder}</span>}
                </p>
                {r.review && (
                  <p className="rounded-card bg-white px-3 py-2 text-navy/80">
                    <b>Đánh giá {r.review.rating}★{r.review.hidden ? " (đã ẩn)" : ""}:</b> {r.review.comment || <i className="text-navy/50">không có nhận xét</i>}
                  </p>
                )}
                {r.description && <p className="text-navy/80">“{r.description}”</p>}
                <p className="text-xs text-navy/50">
                  {r.reporter} • {formatDateTime(r.createdAt)}
                  {r.handler && ` • xử lý bởi ${r.handler}`}
                </p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${st?.tone}`}>{st?.label}</span>
              {r.status === "open" && r.review && !r.review.hidden && (
                <button
                  type="button"
                  disabled={hide.isPending && hide.variables === r.review.id}
                  onClick={() => hide.mutate(r.review.id, { onSuccess: () => toast.success("Đã ẩn đánh giá"), onError: (e) => toast.error(e.message) })}
                  className="rounded-full bg-danger px-3 py-1 text-xs font-bold text-white disabled:opacity-60"
                >
                  Ẩn đánh giá
                </button>
              )}
              {r.status === "open" && (
                <button
                  type="button"
                  disabled={dismiss.isPending && dismiss.variables === r.id}
                  onClick={() => dismiss.mutate(r.id, { onSuccess: () => toast.success("Đã bác báo cáo"), onError: (e) => toast.error(e.message) })}
                  className="rounded-full bg-white px-3 py-1 text-xs font-bold text-navy/70 hover:bg-outline disabled:opacity-60"
                >
                  Bác
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </li>
  );
}

// Báo cáo vi phạm từ phụ huynh, gom theo truyện. Đủ 3 người khác nhau trong 24 giờ → BE tự tạm gỡ và tạo lượt
// hậu kiểm; chuyên gia vào xem lại truyện để giữ hoặc gỡ hẳn (gỡ hẳn tự cảnh cáo tác giả, đóng các báo cáo).
function ReportsPage() {
  const [status, setStatus] = useState("open");
  const [strike, setStrike] = useState(null);
  const { data: groups = [], isLoading, error } = useReportGroups(status);

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-danger">
          <Flag size={16} /> Giám sát
        </p>
        <h1 className="text-3xl">Báo cáo vi phạm</h1>
        <p className="mt-1 max-w-2xl text-navy/70">
          Đủ 3 phụ huynh khác nhau báo cáo một truyện trong 24 giờ thì hệ thống tự tạm gỡ. Vào xem lại truyện để <b>giữ</b> (bác các báo cáo) hoặc <b>gỡ hẳn</b> (tự cảnh cáo tác giả).
        </p>
      </div>
      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((t) => (
          <button key={t.value} type="button" role="tab" aria-selected={status === t.value} onClick={() => setStatus(t.value)} className={`rounded-full px-4 py-1.5 text-sm font-bold ${status === t.value ? "bg-primary text-white" : "bg-surface text-navy/70"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {isLoading && <Loader2 size={28} className="animate-spin text-primary" />}
      {error && <p className="text-danger">{error.message}</p>}
      {!isLoading && !error && groups.length === 0 && <p className="card p-8 text-center text-navy/60">Không có báo cáo nào ✨</p>}
      <ul className="space-y-4">
        {groups.map((g) => (
          <ReportGroup key={g.listing.id} group={g} onStrike={(seller, reportId) => setStrike({ seller, reportId })} />
        ))}
      </ul>
      {strike && <StrikeModal seller={strike.seller} source="report" sourceId={strike.reportId} onClose={() => setStrike(null)} />}
    </div>
  );
}

export default ReportsPage;
