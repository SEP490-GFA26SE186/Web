import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Flag, Loader2, MessageSquareReply, Star } from "lucide-react";
import { REPORT_CATEGORIES } from "../../../constants/moderation";
import { getReviews, replyReview, reportReview, saveReview } from "../../../services/marketplaceService";
import { toast } from "../../../stores/toastStore";

const REVIEW_TAG_LABELS = {
  child_liked: "Bé rất thích",
  age_appropriate: "Hợp độ tuổi",
  clear_lesson: "Bài học rõ ràng",
  good_narration: "Giọng đọc hay",
};

function Stars({ value, onChange, size = 18 }) {
  return (
    <span className="inline-flex" role={onChange ? "radiogroup" : undefined} aria-label={onChange ? "Số sao" : `${value} sao`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const icon = <Star size={size} className={n <= value ? "fill-amber-400 text-amber-400" : "text-navy/25"} />;
        return onChange ? (
          <button key={n} type="button" role="radio" aria-checked={n === value} aria-label={`${n} sao`} onClick={() => onChange(n)} className="p-0.5">
            {icon}
          </button>
        ) : (
          <span key={n}>{icon}</span>
        );
      })}
    </span>
  );
}

function ReviewForm({ listingId, mine, tags, onDone }) {
  const [rating, setRating] = useState(mine?.rating ?? 0);
  const [comment, setComment] = useState(mine?.comment ?? "");
  const [picked, setPicked] = useState(mine?.tags ?? []);
  const queryClient = useQueryClient();
  const save = useMutation({
    mutationFn: () => saveReview(listingId, { rating, comment: comment.trim() || undefined, tags: picked }),
    onSuccess: () => {
      toast.success(mine ? "Đã cập nhật đánh giá" : "Cảm ơn ba mẹ đã đánh giá!");
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
      onDone?.();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!rating) return toast.error("Ba mẹ chọn số sao nhé");
        save.mutate();
      }}
      className="space-y-3 rounded-card bg-surface p-4"
    >
      <Stars value={rating} onChange={setRating} size={26} />
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => {
          const on = picked.includes(t);
          return (
            <button key={t} type="button" aria-pressed={on} onClick={() => setPicked((p) => (on ? p.filter((x) => x !== t) : [...p, t]))} className={`rounded-full border-[1.5px] px-3 py-1 text-sm font-semibold ${on ? "border-secondary bg-secondary-tint text-secondary-dark" : "border-outline bg-white"}`}>
              {REVIEW_TAG_LABELS[t] ?? t}
            </button>
          );
        })}
      </div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} maxLength={1000} placeholder="Bé thích đoạn nào? Truyện giúp bé điều gì? (không bắt buộc)" aria-label="Nhận xét" className="w-full resize-none rounded-card border-2 border-outline bg-white p-3 text-sm" />
      <button type="submit" disabled={save.isPending} className="btn-primary px-5 py-2 text-sm">
        {save.isPending && <Loader2 size={15} className="animate-spin" />} {mine ? "Lưu đánh giá" : "Gửi đánh giá"}
      </button>
    </form>
  );
}

function ReplyForm({ reviewId }) {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const reply = useMutation({
    mutationFn: () => replyReview(reviewId, text.trim()),
    onSuccess: () => {
      toast.success("Đã trả lời đánh giá");
      queryClient.invalidateQueries({ queryKey: ["marketplace", "reviews"] });
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (text.trim().length >= 2) reply.mutate(); }} className="mt-2 flex gap-2">
      <input value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} placeholder="Trả lời ba mẹ (một lần)" aria-label="Trả lời đánh giá" className="min-w-0 flex-1 rounded-full border-2 border-outline px-4 py-1.5 text-sm" />
      <button type="submit" disabled={reply.isPending} className="btn-ghost px-4 py-1.5 text-sm">Trả lời</button>
    </form>
  );
}

function ReportReview({ reviewId }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("other");
  const report = useMutation({
    mutationFn: () => reportReview(reviewId, { category }),
    onSuccess: () => {
      toast.success("Đã gửi báo cáo, kiểm duyệt viên sẽ xem xét");
      setOpen(false);
    },
    onError: (e) => toast.error(e.message),
  });
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1 text-xs text-navy/40 hover:text-danger">
        <Flag size={12} /> Báo cáo
      </button>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs">
      <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Loại vi phạm" className="rounded-full border border-outline px-2 py-0.5">
        {Object.entries(REPORT_CATEGORIES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <button type="button" onClick={() => report.mutate()} disabled={report.isPending} className="font-bold text-danger">Gửi</button>
      <button type="button" onClick={() => setOpen(false)} className="text-navy/50">Huỷ</button>
    </span>
  );
}

// Đánh giá truyện (luồng 4.6): chỉ ba mẹ đã mua và có bé đọc hết truyện mới đánh giá được.
function ListingReviews({ listing }) {
  const [editing, setEditing] = useState(false);
  const { data, isLoading } = useQuery({ queryKey: ["marketplace", "reviews", listing.id], queryFn: () => getReviews(listing.id) });
  if (isLoading || !data) return <Loader2 size={22} className="animate-spin text-primary" />;
  const total = Object.values(data.distribution).reduce((a, b) => a + b, 0);

  return (
    <section className="card space-y-4 p-6">
      <div className="flex flex-wrap items-center gap-4">
        <h2 className="text-xl">Đánh giá</h2>
        {total > 0 ? (
          <span className="flex items-center gap-2 text-sm">
            <Stars value={Math.round(listing.ratingAvg)} /> <b>{listing.ratingAvg.toFixed(1)}</b> ({total} đánh giá)
          </span>
        ) : (
          <span className="text-sm text-navy/50">Chưa có đánh giá</span>
        )}
      </div>

      {data.myReview?.hidden ? (
        <p className="rounded-card bg-danger-tint p-3 text-sm text-danger">Đánh giá của ba mẹ đã bị ẩn do vi phạm quy định cộng đồng.</p>
      ) : data.canReview ? (
        data.myReview && !editing ? (
          <p className="text-sm text-navy/70">
            Ba mẹ đã đánh giá {data.myReview.rating} sao.{" "}
            <button type="button" onClick={() => setEditing(true)} className="font-bold text-primary hover:underline">Sửa đánh giá</button>
          </p>
        ) : (
          <ReviewForm listingId={listing.id} mine={data.myReview} tags={data.tags} onDone={() => setEditing(false)} />
        )
      ) : (
        !data.isSeller && listing.owned && <p className="text-sm text-navy/60">Khi bé đọc hết truyện, ba mẹ có thể đánh giá để giúp các gia đình khác chọn truyện.</p>
      )}

      <ul className="divide-y divide-outline">
        {data.reviews.map((r) => (
          <li key={r.id} className="space-y-1 py-3">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Stars value={r.rating} size={15} />
              <b>{r.author}</b>
              <span className="text-xs text-navy/50">{new Date(r.updatedAt).toLocaleDateString("vi-VN")}</span>
              {!r.mine && !data.isSeller && <span className="ml-auto"><ReportReview reviewId={r.id} /></span>}
            </div>
            {r.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {r.tags.map((t) => <span key={t} className="rounded-full bg-secondary-tint px-2 py-0.5 text-xs font-semibold text-secondary-dark">{REVIEW_TAG_LABELS[t] ?? t}</span>)}
              </div>
            )}
            {r.comment && <p className="text-sm text-navy/80">{r.comment}</p>}
            {r.sellerReply ? (
              <p className="ml-4 flex gap-1.5 rounded-card bg-surface p-2.5 text-sm text-navy/80">
                <MessageSquareReply size={15} className="mt-0.5 shrink-0 text-primary" /> <span><b>Người bán:</b> {r.sellerReply}</span>
              </p>
            ) : (
              data.isSeller && <ReplyForm reviewId={r.id} />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ListingReviews;
