import { Bot, FileText, ShoppingCart, Star, Store } from "lucide-react";
import { formatNumber, formatVND } from "../../../utils/format";
import CaselTag from "../library/CaselTag";
import { coverGradient } from "../library/storyMeta";
import StoryCover from "../StoryCover";

function PriceBadge({ priceVnd }) {
  return priceVnd === 0 ? (
    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-white shadow-low">Miễn phí</span>
  ) : (
    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy shadow-low backdrop-blur">
      {formatVND(priceVnd)}
    </span>
  );
}

// Thẻ truyện đang bán trên chợ (listing đã được Moderator duyệt)
function ListingCard({ listing, onAddToCart }) {
  const { topic, priceTier, seller } = listing;

  return (
    <article className="group card flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-high">
      <StoryCover
        emoji={listing.coverEmoji}
        gradient={coverGradient(listing.id)}
        alt={listing.title}
        className="h-44 w-full [&>div]:transition-transform [&>div]:duration-500 group-hover:[&>div]:scale-105"
      >
        <span className="absolute top-3 left-3">
          <CaselTag competency={topic.competency} short />
        </span>
        <span className="absolute top-3 right-3">
          <PriceBadge priceVnd={priceTier.priceVnd} />
        </span>
      </StoryCover>

      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2 text-xs text-navy/60">
            <span className="tag-eq py-0.5">
              {topic.ageMin}–{topic.ageMax} tuổi
            </span>
            <span className="flex items-center gap-1">
              <Star size={13} className="fill-primary text-primary" />
              <b className="text-navy">{listing.ratingAvg.toFixed(1)}</b> ({formatNumber(listing.ratingCount)})
            </span>
          </div>
          <h3 className="line-clamp-2 text-lg transition-colors group-hover:text-primary-dark">{listing.title}</h3>
          <p className="line-clamp-2 text-sm text-navy/65">{listing.description}</p>
        </div>

        <div className="flex flex-col gap-2 pt-1 text-xs text-navy/60">
          <p className="line-clamp-1 font-semibold text-secondary-dark">Bài học: {topic.title}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-1">
              <FileText size={12} /> {listing.totalPages} trang
            </span>
            <span className="flex items-center gap-1">
              <ShoppingCart size={12} /> {formatNumber(listing.purchaseCount)} lượt mua
            </span>
            {listing.hasAiContent && (
              <span className="flex items-center gap-1" title="Truyện có nội dung do AI hỗ trợ, đã được người bán và Moderator xem lại">
                <Bot size={12} /> AI hỗ trợ
              </span>
            )}
          </div>
          <p className="flex items-center gap-1 truncate">
            <Store size={12} className="shrink-0" /> {seller.displayName}
          </p>
          <button
            onClick={() => onAddToCart(listing)}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-bold text-navy transition hover:bg-primary hover:text-white"
          >
            <ShoppingCart size={15} /> {priceTier.priceVnd === 0 ? "Nhận miễn phí" : "Thêm vào giỏ"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ListingCard;
