import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Loader2, PauseCircle, PenLine } from "lucide-react";
import StrikeModal from "../../components/specialist/StrikeModal";
import { DECISION_LABELS, REVIEW_TYPES, formatDateTime } from "../../constants/moderation";
import { ROUTES } from "../../constants/routes";
import { useRestrictedListings } from "../../hooks/useSpecialist";

const TABS = [
  { value: "suspended", label: "Đang tạm gỡ" },
  { value: "archived", label: "Đã gỡ hẳn" },
];

// Truyện tạm gỡ: ẩn khỏi chợ, không mua được, bé đã mua tạm không đọc được — chờ chuyên gia xem lại để giữ hoặc gỡ hẳn.
function SuspendedPage() {
  const [status, setStatus] = useState("suspended");
  const [strike, setStrike] = useState(null);
  const { data: rows = [], isLoading, error } = useRestrictedListings(status);

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-danger">
          <PauseCircle size={16} /> Giám sát
        </p>
        <h1 className="text-3xl">Truyện tạm gỡ</h1>
        <p className="mt-1 max-w-2xl text-navy/70">
          Truyện tạm gỡ bị ẩn khỏi Chợ truyện, không mua được, và bé đã mua cũng tạm không đọc được cho tới khi có quyết định.
        </p>
      </div>
      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((t) => (
          <button key={t.value} type="button" role="tab" aria-selected={status === t.value} onClick={() => setStatus(t.value)} className={`rounded-full px-4 py-1.5 text-sm font-bold ${status === t.value ? "bg-primary text-white" : "bg-surface text-navy/70"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <section className="card overflow-hidden">
        {isLoading && <Loader2 size={28} className="m-5 animate-spin text-primary" />}
        {error && <p className="p-5 text-danger">{error.message}</p>}
        {!isLoading && !error && rows.length === 0 && <p className="p-8 text-center text-navy/60">Không có truyện nào.</p>}
        <ul className="divide-y divide-outline">
          {rows.map((l) => {
            const r = l.review;
            const open = r && !r.decidedAt;
            return (
              <li key={l.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="font-bold">{l.title}</p>
                  <p className="text-sm text-navy/60">
                    {l.seller.displayName}
                    {l.seller.status === "suspended" && <b className="text-danger"> (tài khoản bán đang khoá)</b>} • {l.reportsCount} báo cáo • {l.buyersCount} người đã mua •
                    cập nhật {formatDateTime(l.updatedAt)}
                  </p>
                  {r?.decidedAt && (
                    <p className="text-sm text-navy/70">
                      {DECISION_LABELS[r.decision]} bởi {r.moderator}: {r.comment}
                    </p>
                  )}
                </div>
                {open && (
                  <Link to={ROUTES.SPECIALIST.workspace(r.id)} className="btn-primary px-4 py-2 text-sm">
                    <PenLine size={15} /> {REVIEW_TYPES[r.reviewType]?.label}: xem lại
                  </Link>
                )}
                <button type="button" onClick={() => setStrike({ id: l.seller.id, displayName: l.seller.displayName })} className="btn-ghost px-4 py-2 text-sm">
                  <AlertTriangle size={15} /> Cảnh cáo
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      {strike && <StrikeModal seller={strike} source="takedown" onClose={() => setStrike(null)} />}
    </div>
  );
}

export default SuspendedPage;
