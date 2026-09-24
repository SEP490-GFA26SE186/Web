import { BadgeCheck, CheckCircle2, ClipboardCheck, FilePenLine, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

// Bản thảo truyện do AI tạo, phụ huynh phải duyệt trước khi bé được đọc
function DraftReviewCard({ draft, parentTitle }) {
  const remaining = draft ? draft.totalPages - draft.reviewedPages : 0;
  const percent = draft ? Math.round((draft.reviewedPages / draft.totalPages) * 100) : 0;
  const reviewUrl = draft ? `${ROUTES.PARENT.STUDIO}?draft=${draft.id}` : ROUTES.PARENT.STUDIO;

  return (
    <section className="card flex flex-1 flex-col justify-between p-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg">
            <ClipboardCheck size={22} className="text-primary" /> Bản thảo cần {parentTitle} duyệt
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
            <p className="font-display font-bold">Không có bản thảo nào đang chờ</p>
            <p className="text-sm text-navy/70">Mọi câu chuyện của bé đều đã được duyệt ✨</p>
          </div>
        ) : (
          <>
            <article className="space-y-3 rounded-2xl bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="tag-theme">Chờ {parentTitle} phê duyệt</span>
                {draft.moderationPassed && (
                  <span className="flex items-center gap-0.5 text-xs font-bold text-secondary-dark">
                    <BadgeCheck size={15} /> 100% Kiểm duyệt
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-lg">{draft.title}</h4>
                <p className="mt-1 text-sm text-navy/65">
                  Tạo từ mẫu chuẩn {draft.template}: <span className="font-semibold text-navy">{draft.skill}</span>.{" "}
                  {draft.description}
                </p>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-navy/60">Tiến độ duyệt nội dung</span>
                  <span className="font-bold text-primary-dark">
                    {draft.reviewedPages}/{draft.totalPages} trang đã duyệt ({percent}%)
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
                {remaining > 0 ? `Duyệt & Hoàn tất (${remaining} trang còn lại)` : "Hoàn tất & Xuất bản cho bé"}
              </Link>
              <Link
                to={reviewUrl}
                className="w-full rounded-full bg-surface py-2.5 text-center text-sm font-semibold text-navy/70 transition hover:bg-outline hover:text-navy"
              >
                Xem lại toàn bộ bản thảo
              </Link>
            </div>
          </>
        )}
      </div>

      <p className="mt-4 flex flex-wrap items-center justify-center gap-1.5 border-t border-outline pt-3 text-center text-xs text-navy/60">
        <ShieldCheck size={15} className="text-secondary" />
        Ghi chú an toàn AI: Tên bé đã được ẩn danh tính • Phụ huynh nắm quyền quyết định cuối cùng.
      </p>
    </section>
  );
}

export default DraftReviewCard;
