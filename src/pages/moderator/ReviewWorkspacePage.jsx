import { Fragment, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Eye, Loader2, Lock } from "lucide-react";
import CaselTag from "../../components/parent/library/CaselTag";
import { CHECKPOINT_TYPES, EMOTIONS } from "../../constants/story";
import { ROUTES } from "../../constants/routes";
import { useClaimReview, useDecideReview, useReview, useViewPage } from "../../hooks/useModerator";
import { toast } from "../../stores/toastStore";
import { formatNumber } from "../../utils/format";

const DECISIONS = [
  { value: "approved", label: "Duyệt & xuất bản", tone: "btn-primary" },
  { value: "changes_requested", label: "Yêu cầu sửa", tone: "btn-ghost" },
  { value: "rejected", label: "Từ chối", tone: "btn-ghost text-danger" },
];
const ROLE_LABELS = { constructive: "Xây dựng", avoidant: "Né tránh", impulsive: "Bốc đồng" };

/** Chữ dạng token → tên chung người bán đặt (bản đăng bán không có tên thật). */
const withNames = (text, characters) =>
  (text ?? "").replace(/\{NV\d+\}/g, (t) => characters.find((c) => c.token === t)?.name ?? t);

function CheckpointBlock({ cp, characters }) {
  const n = (s) => withNames(s, characters);
  return (
    <div className="ml-4 space-y-2 rounded-card border-2 border-dashed border-outline bg-surface p-4 text-sm sm:ml-8">
      <p className="font-bold text-secondary-dark">Điểm dừng: {CHECKPOINT_TYPES[cp.type]?.label ?? cp.type}</p>
      <p>
        <b>Câu hỏi:</b> {n(cp.question)}
      </p>
      {cp.answerEmotion && (
        <p>
          <b>Đáp án:</b> {EMOTIONS[cp.answerEmotion] ?? cp.answerEmotion}
        </p>
      )}
      {cp.hint && (
        <p>
          <b>Gợi ý:</b> {n(cp.hint)}
        </p>
      )}
      {cp.options?.length > 0 && (
        <ul className="list-disc space-y-1 pl-5">
          {cp.options.map((o) => (
            <li key={o.id}>
              {n(o.text)}
              {o.isCorrect && <b className="text-secondary-dark"> ✓ đúng</b>}
              {o.role && <span className="text-navy/60"> ({ROLE_LABELS[o.role]})</span>}
              {o.feedback && <span className="text-navy/60"> → {n(o.feedback)}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Không gian duyệt một truyện đăng bán: nhận bài → xem từng trang (đánh dấu đã xem, nhận xét) →
// checklist 7 nguyên tắc → quyết định. BE chỉ cho duyệt khi xem 100% trang và đạt đủ checklist.
function Workspace({ reviewId }) {
  const { data, isLoading, error } = useReview(reviewId);
  const claim = useClaimReview(reviewId);
  const view = useViewPage(reviewId);
  const decide = useDecideReview(reviewId);
  const [checks, setChecks] = useState({});
  const [comment, setComment] = useState("");
  const [notes, setNotes] = useState({});

  if (isLoading) return <Loader2 size={32} className="animate-spin text-primary" />;
  if (error) return <p className="card p-6 text-danger">{error.message}</p>;

  const { review, listing, seller, story, checklist, pageViews, progress } = data;
  const viewed = new Map(pageViews.map((v) => [v.pageId, v]));
  const cpAfter = new Map(story.checkpoints.map((c) => [c.afterPageId, c]));
  const decided = !!review.decidedAt;
  const canAct = review.claimedByMe && !decided;
  const passedOf = (item) => checks[item.id] ?? item.passed;

  const submit = (decision) =>
    decide.mutate(
      { decision, comment: comment.trim() || undefined, checklist: checklist.map((i) => ({ itemId: i.id, passed: passedOf(i) === true })) },
      { onSuccess: () => toast.success("Đã lưu quyết định"), onError: (e) => toast.error(e.message) },
    );

  return (
    <div className="space-y-5">
      <Link to={ROUTES.MODERATOR.DASHBOARD} className="inline-flex items-center gap-1 text-sm font-semibold text-navy/60 hover:text-primary">
        <ArrowLeft size={16} /> Hàng chờ
      </Link>

      <header className="card flex flex-wrap items-start justify-between gap-4 p-5">
        <div className="space-y-1">
          <div className="flex flex-wrap gap-2">
            <CaselTag competency={story.topic?.competency} className="bg-secondary-tint" />
            <span className="tag-theme">{listing.priceVnd ? `${formatNumber(listing.priceVnd)}đ` : "Miễn phí"}</span>
            {listing.hasAiContent && <span className="tag-eq">Có AI hỗ trợ</span>}
          </div>
          <h1 className="text-2xl">{listing.title}</h1>
          <p className="text-sm text-navy/60">
            Người bán: <b>{seller}</b> • Bài học: {story.topic?.title} • Nhân vật: {story.characters.map((c) => c.name).join(", ")}
          </p>
          {listing.description && <p className="text-sm text-navy/70">{listing.description}</p>}
        </div>
        {decided ? (
          <span className="rounded-full bg-secondary-tint px-3 py-1 text-sm font-bold text-secondary-dark">Đã quyết định: {review.decision}</span>
        ) : review.claimedByMe ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-tint px-3 py-1 text-sm font-bold text-primary-dark">
            <Lock size={14} /> Bạn đang giữ bài đến {new Date(review.claimExpiresAt).toLocaleTimeString("vi-VN")}
          </span>
        ) : (
          <button type="button" onClick={() => claim.mutate(undefined, { onError: (e) => toast.error(e.message) })} disabled={claim.isPending} className="btn-primary">
            {claim.isPending && <Loader2 size={16} className="animate-spin" />} Nhận bài để duyệt
          </button>
        )}
      </header>

      <p className="text-sm font-semibold text-navy/70" aria-live="polite">
        Đã xem {progress.pagesViewed}/{progress.pagesTotal} trang • Checklist đạt {progress.checklistPassed}/{progress.checklistTotal}
      </p>

      {story.pages.map((page) => {
        const seen = viewed.get(page.id);
        const cp = cpAfter.get(page.id);
        return (
          <Fragment key={page.id}>
            <article className={`card space-y-3 p-5 ${seen ? "border-secondary/40" : ""}`}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg">Trang {page.pageOrder}</h2>
                {seen ? (
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-secondary-dark">
                    <CheckCircle2 size={16} /> Đã xem
                  </span>
                ) : null}
              </div>
              <p className="whitespace-pre-line">{withNames(page.contentText, story.characters)}</p>
              {canAct && (
                <div className="flex flex-wrap items-end gap-2">
                  <input
                    value={notes[page.id] ?? seen?.comment ?? ""}
                    onChange={(e) => setNotes((m) => ({ ...m, [page.id]: e.target.value }))}
                    placeholder="Nhận xét cho trang này (không bắt buộc)"
                    aria-label={`Nhận xét trang ${page.pageOrder}`}
                    className="min-w-56 flex-1 rounded-card border-2 border-outline px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => view.mutate({ pageId: page.id, comment: notes[page.id] })}
                    disabled={view.isPending}
                    className="btn-ghost px-4 py-2 text-sm"
                  >
                    <Eye size={16} /> {seen ? "Lưu nhận xét" : "Đánh dấu đã xem"}
                  </button>
                </div>
              )}
              {!canAct && seen?.comment && <p className="text-sm text-navy/60">Nhận xét: {seen.comment}</p>}
            </article>
            {cp && <CheckpointBlock cp={cp} characters={story.characters} />}
          </Fragment>
        );
      })}

      <section className="card space-y-3 p-5">
        <h2 className="text-lg">Checklist 7 nguyên tắc</h2>
        {checklist.map((item) => (
          <label key={item.id} className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              disabled={!canAct}
              checked={passedOf(item) === true}
              onChange={(e) => setChecks((m) => ({ ...m, [item.id]: e.target.checked }))}
              className="mt-1 h-4 w-4"
            />
            {item.description}
          </label>
        ))}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!canAct}
          rows={3}
          placeholder="Nhận xét chung (bắt buộc khi yêu cầu sửa / từ chối)"
          aria-label="Nhận xét chung"
          className="w-full rounded-card border-2 border-outline p-3 text-sm"
        />
        <div className="flex flex-wrap gap-2">
          {DECISIONS.map((d) => (
            <button key={d.value} type="button" disabled={!canAct || decide.isPending} onClick={() => submit(d.value)} className={`${d.tone} disabled:opacity-50`}>
              {decide.isPending && decide.variables?.decision === d.value && <Loader2 size={16} className="animate-spin" />}
              {d.label}
            </button>
          ))}
        </div>
        {decided && review.comment && <p className="text-sm text-navy/60">Nhận xét đã gửi: {review.comment}</p>}
      </section>
    </div>
  );
}

function ReviewWorkspacePage() {
  const { storyId: reviewId } = useParams();
  return <Workspace key={reviewId} reviewId={reviewId} />;
}

/** /moderator/workspace → về hàng chờ để chọn bài. */
export function WorkspaceIndexRedirect() {
  return <Navigate to={ROUTES.MODERATOR.DASHBOARD} replace />;
}

export default ReviewWorkspacePage;
