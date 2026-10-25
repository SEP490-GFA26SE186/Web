import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Bot, Check, FileText, Loader2, ShieldCheck, ShoppingCart, Store, Type, Volume2 } from "lucide-react";
import CaselTag from "../../../components/parent/library/CaselTag";
import { coverOf } from "../../../components/parent/library/storyMeta";
import StoryCover from "../../../components/parent/StoryCover";
import ListingReviews from "../../../components/parent/marketplace/ListingReviews";
import ReportListingButton from "../../../components/parent/marketplace/ReportListingButton";
import ShelfChildList from "../../../components/parent/studio/ShelfChildList";
import { ROUTES } from "../../../constants/routes";
import { useCheckoutListing, useListing } from "../../../hooks/useMarketplace";
import { useShelfStatus, useToggleShelf } from "../../../hooks/useStudio";
import { toast } from "../../../stores/toastStore";
import { formatListingPrice, formatNumber } from "../../../utils/format";

/** Truyện đã có: đưa lên giá sách của từng bé (bản đăng bán dùng nguyên trạng, tên chung). */
function OwnedShelf({ storyId }) {
  const { data, isLoading } = useShelfStatus(storyId);
  const toggle = useToggleShelf(storyId);
  if (isLoading) return <Loader2 size={20} className="animate-spin text-primary" />;
  if (!data?.children?.length) return <p className="text-sm text-navy/60">Ba mẹ thêm hồ sơ bé để đưa truyện lên giá sách.</p>;
  return (
    <ShelfChildList
      kids={data.children}
      busyId={toggle.isPending ? toggle.variables?.childId : null}
      onToggle={(c) =>
        toggle.mutate(
          { childId: c.childId, add: !c.inBookshelf },
          { onSuccess: () => toast.success(c.inBookshelf ? `Đã bỏ khỏi giá của ${c.name}` : `Đã đưa lên giá của ${c.name}`), onError: (e) => toast.error(e.message) },
        )
      }
    />
  );
}

// Chi tiết truyện đang bán: xem trước trang đầu, mua qua payOS (0đ nhận ngay), rồi đưa lên giá sách.
function ListingDetailPage() {
  const { listingId } = useParams();
  const { data: l, isLoading, error } = useListing(listingId);
  const checkout = useCheckoutListing();

  if (isLoading) return <Loader2 size={32} className="animate-spin text-primary" />;
  if (error) return <p className="card p-6 text-danger">{error.message}</p>;

  const free = Number(l.priceVnd) === 0;
  const buy = () =>
    checkout.mutate(l.id, {
      onSuccess: ({ checkoutUrl }) => {
        if (checkoutUrl) window.location.assign(checkoutUrl);
        else toast.success("Đã nhận truyện — đưa lên giá sách cho bé nhé!");
      },
      onError: (e) => toast.error(e.message),
    });

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link to={ROUTES.PARENT.MARKETPLACE} className="group inline-flex items-center gap-1.5 rounded-full py-1 pr-2 text-sm font-semibold text-navy/60 transition hover:text-primary-dark">
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" /> Chợ truyện
      </Link>
      <article className="card space-y-4 p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <StoryCover cover={coverOf(l)} title={l.title} className="aspect-square w-full shrink-0 rounded-2xl shadow-low sm:w-48" />
          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <CaselTag competency={l.topic?.competency} className="bg-secondary-tint" />
              {l.topic && <span className="tag-eq">{l.topic.ageMin}–{l.topic.ageMax} tuổi</span>}
              {l.hasAiContent && (
                <span className="tag-theme">
                  <Bot size={12} /> AI hỗ trợ
                </span>
              )}
              <span className={l.hasNarration ? "tag-eq" : "tag-theme"}>
                {l.hasNarration ? <Volume2 size={12} /> : <Type size={12} />} {l.hasNarration ? "Có giọng đọc" : "Chỉ có chữ — ba mẹ đọc cùng bé"}
              </span>
            </div>
            <h1 className="text-3xl">{l.title}</h1>
            {l.description && <p className="text-navy/70">{l.description}</p>}
          </div>
        </div>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy/60">
          {l.topic && <span>Bài học: {l.topic.title}</span>}
          <span className="flex items-center gap-1">
            <FileText size={14} /> {l.totalPages} trang • {l.checkpointCount} điểm dừng
          </span>
          <Link to={ROUTES.PARENT.marketplaceSeller(l.seller.id)} className="flex items-center gap-1 font-semibold text-primary-dark hover:underline">
            <Store size={14} /> {l.seller.displayName}
          </Link>
          <span className="flex items-center gap-1">
            <ShoppingCart size={14} /> {formatNumber(l.purchaseCount)} lượt mua
          </span>
        </p>
        {l.preview && (
          <blockquote className="rounded-card bg-surface p-4 text-navy/80">
            <p className="mb-1 text-xs font-bold tracking-wide text-navy/50 uppercase">Trang 1</p>
            {l.preview}
          </blockquote>
        )}
        <p className="flex items-start gap-2 text-sm text-navy/60">
          <ShieldCheck size={18} className="shrink-0 text-secondary" /> Chuyên gia sư phạm đã duyệt từng trang theo checklist sư phạm. Truyện dùng tên nhân vật chung, có thể đọc ngay trên giá sách của bé.
        </p>

        {l.isMine ? (
          <p className="font-semibold text-navy/60">Đây là truyện ba mẹ đăng bán.</p>
        ) : l.owned ? (
          <div className="space-y-2">
            <p className="flex items-center gap-1 font-bold text-secondary-dark">
              <Check size={18} /> Ba mẹ đã có truyện này
            </p>
            <OwnedShelf storyId={l.publishedStoryId} />
          </div>
        ) : (
          <button type="button" onClick={buy} disabled={checkout.isPending} className="btn-primary w-full px-8 py-3.5 text-lg sm:w-auto">
            {checkout.isPending ? <Loader2 size={20} className="animate-spin" /> : <ShoppingCart size={20} />}
            {free ? "Nhận miễn phí" : `Mua ${formatListingPrice(l.priceVnd)} qua payOS`}
          </button>
        )}
        {!l.isMine && (
          <div className="border-t border-outline pt-3">
            <ReportListingButton listingId={l.id} />
          </div>
        )}
      </article>
      <ListingReviews listing={l} />
    </div>
  );
}

export default ListingDetailPage;
