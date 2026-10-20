import { useState } from "react";
import { Link } from "react-router-dom";
import { ListChecks, Loader2, PenLine, Shuffle } from "lucide-react";
import { DECISION_LABELS, LISTING_STATUS, formatDateTime } from "../../constants/moderation";
import { ROUTES } from "../../constants/routes";
import { useAudits, useRunAudits } from "../../hooks/useSpecialist";
import { toast } from "../../stores/toastStore";

// Kiểm tra ngẫu nhiên: mỗi tuần hệ thống chọn vài truyện đang bán (ưu tiên truyện lâu chưa kiểm) để chuyên gia
// xem lại theo checklist. Không ảnh hưởng truyện khi đang kiểm; gỡ hẳn nếu phát hiện vi phạm.
function AuditsPage() {
  const [count, setCount] = useState(3);
  const { data: audits = [], isLoading, error } = useAudits();
  const run = useRunAudits();

  const start = () =>
    run.mutate(count, {
      onSuccess: ({ created }) => (created ? toast.success(`Đã chọn ${created} truyện để kiểm tra`) : toast.info("Không còn truyện đang bán nào để chọn")),
      onError: (e) => toast.error(e.message),
    });

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-primary-dark">
            <ListChecks size={16} /> Giám sát
          </p>
          <h1 className="text-3xl">Kiểm tra ngẫu nhiên</h1>
          <p className="mt-1 max-w-2xl text-navy/70">
            Mỗi tuần hệ thống tự chọn vài truyện đang bán để xem lại theo checklist, kể cả truyện chưa ai báo cáo. Truyện vẫn bán bình thường trong lúc kiểm.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start whitespace-nowrap">
          <input
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
            aria-label="Số truyện"
            className="w-20 rounded-full border-[1.5px] border-outline px-4 py-2.5 text-sm"
          />
          <button type="button" onClick={start} disabled={run.isPending} className="btn-primary">
            {run.isPending ? <Loader2 size={18} className="animate-spin" /> : <Shuffle size={18} />} Chọn đợt ngay
          </button>
        </div>
      </div>

      <section className="card overflow-hidden">
        {isLoading && <Loader2 size={28} className="m-5 animate-spin text-primary" />}
        {error && <p className="p-5 text-danger">{error.message}</p>}
        {!isLoading && !error && audits.length === 0 && <p className="p-8 text-center text-navy/60">Chưa có đợt kiểm tra nào.</p>}
        <ul className="divide-y divide-outline">
          {audits.map((a) => {
            const st = LISTING_STATUS[a.listing.status];
            return (
              <li key={a.reviewId} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold">{a.listing.title}</p>
                    {st && <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${st.tone}`}>{st.label}</span>}
                  </div>
                  <p className="text-sm text-navy/60">
                    {a.listing.seller} • chọn {formatDateTime(a.createdAt)}
                    {a.decidedAt && ` • ${DECISION_LABELS[a.decision]} bởi ${a.moderator} (${formatDateTime(a.decidedAt)})`}
                  </p>
                  {a.comment && <p className="text-sm text-navy/70">{a.comment}</p>}
                </div>
                {!a.decidedAt && (
                  <Link to={ROUTES.SPECIALIST.workspace(a.reviewId)} className="btn-primary px-4 py-2 text-sm">
                    <PenLine size={15} /> Kiểm tra
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

export default AuditsPage;
