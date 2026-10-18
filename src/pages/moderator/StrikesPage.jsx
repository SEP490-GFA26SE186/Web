import { useState } from "react";
import { AlertTriangle, Loader2, Plus } from "lucide-react";
import StrikeModal from "../../components/moderator/StrikeModal";
import { APPEAL_STATUS, STRIKE_SOURCES, formatDate } from "../../constants/moderation";
import { useSellerApplications, useStrikes } from "../../hooks/useModerator";

const strikeState = (s) =>
  s.revokedAt
    ? { label: "Đã gỡ (kháng nghị)", tone: "bg-secondary-tint text-secondary-dark" }
    : s.active
      ? { label: `Hiệu lực đến ${formatDate(s.expiresAt)}`, tone: "bg-danger-tint text-danger" }
      : { label: "Hết hạn", tone: "bg-navy-tint text-navy" };

// Cảnh cáo tác giả: hiệu lực 90 ngày; đủ 3 cảnh cáo còn hiệu lực → tài khoản bán bị khoá (ẩn mọi truyện).
// Người bán kháng nghị một lần / cảnh cáo; Admin (khác người ra cảnh cáo) xét.
function StrikesPage() {
  const [activeOnly, setActiveOnly] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const { data, isLoading, error } = useStrikes({ active: activeOnly });
  const { data: sellers = [] } = useSellerApplications("approved");
  const strikes = data?.strikes ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-danger">
            <AlertTriangle size={16} /> Giám sát
          </p>
          <h1 className="text-3xl">Cảnh cáo tác giả</h1>
          <p className="mt-1 max-w-2xl text-navy/70">
            Cảnh cáo hiệu lực 90 ngày. Đủ <b>{data?.strikeLimit ?? 3}</b> cảnh cáo còn hiệu lực thì tài khoản bán bị khoá. Người bán được kháng nghị, Admin xét.
          </p>
        </div>
        <button type="button" onClick={() => setIssuing(true)} className="btn-primary shrink-0 self-start whitespace-nowrap">
          <Plus size={18} /> Ra cảnh cáo
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={activeOnly} onChange={(e) => setActiveOnly(e.target.checked)} className="h-4 w-4" />
        Chỉ cảnh cáo còn hiệu lực
      </label>

      <section className="card overflow-hidden">
        {isLoading && <Loader2 size={28} className="m-5 animate-spin text-primary" />}
        {error && <p className="p-5 text-danger">{error.message}</p>}
        {!isLoading && !error && strikes.length === 0 && <p className="p-8 text-center text-navy/60">Không có cảnh cáo nào.</p>}
        <ul className="divide-y divide-outline">
          {strikes.map((s) => {
            const st = strikeState(s);
            const ap = s.appeal && APPEAL_STATUS[s.appeal.status];
            return (
              <li key={s.id} className="space-y-1 px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold">{s.seller.displayName}</p>
                  {s.seller.status === "suspended" && <span className="rounded-full bg-danger px-2 py-0.5 text-xs font-bold text-white">Tài khoản bán đang khoá</span>}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${st.tone}`}>{st.label}</span>
                  {ap && <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${ap.tone}`}>Kháng nghị: {ap.label}</span>}
                </div>
                <p className="text-sm text-navy/80">{s.reason}</p>
                <p className="text-xs text-navy/50">
                  {STRIKE_SOURCES[s.source]} • {formatDate(s.issuedAt)} • bởi {s.issuer?.name}
                </p>
                {s.appeal && <p className="text-sm text-navy/60">Lý do kháng nghị: “{s.appeal.reason}”{s.appeal.decisionNote && ` — Admin: ${s.appeal.decisionNote}`}</p>}
              </li>
            );
          })}
        </ul>
      </section>
      {issuing && <StrikeModal sellers={sellers} source="report" onClose={() => setIssuing(false)} />}
    </div>
  );
}

export default StrikesPage;
