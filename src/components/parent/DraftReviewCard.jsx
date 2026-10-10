import { Bot, CheckCircle2, ClipboardCheck, FilePenLine, PenLine, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { STORY_LENGTH_LABELS } from "../../constants/casel";
import { ROUTES } from "../../constants/routes";
import CaselTag from "./library/CaselTag";

// Truyện riêng đã tạo xong, ba mẹ phải xem lại hết từng trang trước khi đưa lên giá sách của bé
function DraftReviewCard({ draft, moreCount = 0 }) {
  const remaining = draft ? draft.totalPages - draft.reviewedPages : 0;
  const percent = draft ? Math.round((draft.reviewedPages / draft.totalPages) * 100) : 0;
  const reviewUrl = draft ? `${ROUTES.PARENT.STUDIO}?story=${draft.id}` : ROUTES.PARENT.STUDIO;

  return (
    <section className="card flex flex-1 flex-col justify-between p-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg">
            <ClipboardCheck size={22} className="text-primary" /> Truyện chờ ba mẹ xem lại
          </h3>
          {draft && (
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
          )}
        </div>

        {!draft ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-secondary-tint p-6 text-center">
            <CheckCircle2 size={36} className="text-secondary" />
            <p className="font-display font-bold">Không có truyện nào đang chờ</p>
            <p className="text-sm text-navy/70">Mọi truyện ba mẹ tạo đều đã được xem lại ✨</p>
          </div>
        ) : (
          <>
            <article className="space-y-3 rounded-2xl bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <CaselTag competency={draft.topic.competency} className="bg-white" />
                <span className="flex items-center gap-1 text-xs font-bold text-navy/60">
                  {draft.mode === "ai" ? <Bot size={14} /> : <PenLine size={14} />}
                  {draft.mode === "ai" ? "AI viết giúp" : "Tự viết"}
                </span>
              </div>
              <div>
                <h4 className="text-lg">{draft.title}</h4>
                <p className="mt-1 text-sm text-navy/65">
                  Bài học: <span className="font-semibold text-navy">{draft.topic.title}</span> · {draft.totalPages} trang (
                  {STORY_LENGTH_LABELS[draft.length]}) · {draft.checkpointsCount} điểm dừng
                </p>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-navy/60">Tiến độ xem lại</span>
                  <span className="font-bold text-primary-dark">
                    {draft.reviewedPages}/{draft.totalPages} trang ({percent}%)
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-outline p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dark transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </article>

            <div className="mt-4 flex flex-col gap-2">
              <Link to={reviewUrl} className="btn-primary w-full py-3 hover:shadow-glow">
                <FilePenLine size={20} />
                {remaining > 0 ? `Xem lại tiếp (${remaining} trang còn lại)` : "Hoàn tất & đưa lên giá sách"}
              </Link>
              {moreCount > 0 && (
                <Link
                  to={ROUTES.PARENT.STUDIO}
                  className="w-full rounded-full bg-surface py-2.5 text-center text-sm font-semibold text-navy/70 transition hover:bg-outline hover:text-navy"
                >
                  Còn {moreCount} truyện khác đang chờ
                </Link>
              )}
            </div>
          </>
        )}
      </div>

      <p className="mt-4 flex flex-wrap items-center justify-center gap-1.5 border-t border-outline pt-3 text-center text-xs text-navy/60">
        <ShieldCheck size={15} className="text-secondary" />
        Tên thật của bé được che trước khi gửi AI • Ba mẹ xem lại mọi trang trước khi bé đọc
      </p>
    </section>
  );
}

export default DraftReviewCard;
