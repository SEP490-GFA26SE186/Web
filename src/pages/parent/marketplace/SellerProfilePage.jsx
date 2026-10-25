import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, CalendarDays, Loader2, ShoppingCart, Star, Store } from "lucide-react";
import ListingCard from "../../../components/parent/marketplace/ListingCard";
import { ROUTES } from "../../../constants/routes";
import { useSellerProfile } from "../../../hooks/useMarketplace";
import { formatNumber } from "../../../utils/format";

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3">
      <Icon size={20} className="text-primary-dark" />
      <div>
        <p className="text-xs text-navy/55">{label}</p>
        <p className="font-display text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}

// Hồ sơ công khai người bán: biệt danh, giới thiệu, tổng lượt bán, điểm đánh giá trung bình và các truyện đang bán.
function SellerProfilePage() {
  const { sellerId } = useParams();
  const { data, isLoading, error } = useSellerProfile(sellerId);

  if (isLoading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }
  if (error) return <p className="card p-6 text-danger">{error.message}</p>;

  const { seller, items } = data;
  return (
    <div className="space-y-6">
      <Link to={ROUTES.PARENT.MARKETPLACE} className="inline-flex items-center gap-1 text-sm font-semibold text-navy/60 hover:text-primary">
        <ArrowLeft size={16} /> Chợ truyện
      </Link>

      <header className="card space-y-4 p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-tint text-primary-dark">
            <Store size={26} />
          </span>
          <div>
            <p className="text-sm font-semibold text-secondary-dark">Người bán</p>
            <h1 className="text-3xl">{seller.displayName}</h1>
          </div>
        </div>
        {seller.bio && <p className="max-w-3xl whitespace-pre-line text-navy/75">{seller.bio}</p>}
        {seller.expertise && (
          <p className="text-sm text-navy/65">
            <b>Kinh nghiệm:</b> {seller.expertise}
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={ShoppingCart} label="Tổng lượt bán" value={formatNumber(seller.totalSales)} />
          <Stat
            icon={Star}
            label="Đánh giá trung bình"
            value={seller.ratingAvg == null ? "Chưa có" : `${seller.ratingAvg.toFixed(1)} / 5 (${formatNumber(seller.ratingCount)})`}
          />
          <Stat icon={BookOpen} label="Truyện đang bán" value={formatNumber(seller.listingCount)} />
          <Stat icon={CalendarDays} label="Bán từ" value={new Date(seller.sellingSince).toLocaleDateString("vi-VN")} />
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl">Truyện của {seller.displayName}</h2>
        {items.length === 0 ? (
          <p className="card p-6 text-navy/60">Người bán chưa có truyện nào đang bán.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {items.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default SellerProfilePage;
