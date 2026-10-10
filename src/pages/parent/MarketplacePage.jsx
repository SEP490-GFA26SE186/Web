import { useState } from "react";
import { ArrowDownUp, Loader2, Search, SearchX, Store } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import FilterSelect from "../../components/parent/library/FilterSelect";
import ListingCard from "../../components/parent/marketplace/ListingCard";
import { CASEL, CASEL_OPTIONS } from "../../constants/casel";
import useDebounce from "../../hooks/useDebounce";
import { useListings, usePriceTiers } from "../../hooks/useMarketplace";
import { toast } from "../../stores/toastStore";

const PAGE_SIZE = 8;
const DEFAULT_FILTERS = { competency: "all", age: "all", priceTierId: "all", sort: "best_selling" };

// Truyện dành cho trẻ 5–8 tuổi (topics.age_min / age_max)
const AGE_OPTIONS = [{ value: "all", label: "Tất cả" }, ...[5, 6, 7, 8].map((a) => ({ value: String(a), label: `${a} tuổi` }))];

const SORT_OPTIONS = [
  { value: "best_selling", label: "Bán chạy" },
  { value: "rating", label: "Đánh giá cao" },
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá thấp" },
];

function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search);

  const { data: priceTiers = [] } = usePriceTiers();
  const { data, isLoading, isFetching, isError, refetch } = useListings({
    search: debouncedSearch,
    ...filters,
    page,
    limit: PAGE_SIZE,
  });

  const setFilter = (key) => (value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };
  const resetAll = () => {
    setSearch("");
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const priceOptions = [{ value: "all", label: "Tất cả" }, ...priceTiers.map((t) => ({ value: t.id, label: t.label }))];

  // TODO: giỏ hàng & thanh toán payOS chưa làm
  const handleAddToCart = (listing) => toast.info(`Giỏ hàng đang được hoàn thiện — "${listing.title}"`);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-stage border border-outline bg-gradient-to-r from-surface via-white to-surface p-6 shadow-low">
        <div className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <p className="mb-1 inline-flex items-center gap-1.5 text-xs font-extrabold tracking-wider text-primary-dark uppercase">
          <Store size={14} /> Chợ truyện
        </p>
        <h1 className="text-3xl">Truyện từ các gia đình khác</h1>
        <p className="mt-1 max-w-2xl text-navy/70">
          Mọi truyện đều được Moderator duyệt từng trang theo checklist sư phạm trước khi đăng bán. Mua xong, truyện vào
          giá sách để bé đọc ngay.
        </p>

        <div className="relative mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-navy/40" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Tìm theo tên truyện, bài học, người bán..."
              className="w-full rounded-full border-[1.5px] border-outline bg-white py-2.5 pr-4 pl-11 text-sm transition outline-none placeholder:text-navy/40 focus:border-secondary focus:ring-[3px] focus:ring-secondary/15"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect label="Độ tuổi" value={filters.age} onChange={setFilter("age")} options={AGE_OPTIONS} />
            <FilterSelect label="Giá" value={filters.priceTierId} onChange={setFilter("priceTierId")} options={priceOptions} />
            <FilterSelect label="Sắp xếp" value={filters.sort} onChange={setFilter("sort")} options={SORT_OPTIONS} highlight icon={ArrowDownUp} />
          </div>
        </div>

        {/* Lọc theo năng lực CASEL */}
        <div className="relative -mx-1 mt-4 flex items-center gap-2 overflow-x-auto px-1 pb-1" role="tablist">
          {[{ value: "all", label: "Tất cả năng lực" }, ...CASEL_OPTIONS].map(({ value, label }) => {
            const Icon = CASEL[value]?.icon;
            const active = filters.competency === value;
            return (
              <button
                key={value}
                role="tab"
                aria-selected={active}
                onClick={() => setFilter("competency")(value)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition active:scale-95 ${
                  active ? "bg-primary font-bold text-white shadow-low" : "bg-white font-semibold text-navy/70 hover:bg-surface"
                }`}
              >
                {Icon && <Icon size={14} />} {label}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-2">
          <h2 className="text-2xl">Truyện đang bán</h2>
          <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-navy/70">{data?.pagination.total ?? "…"} truyện</span>
          {isFetching && !isLoading && <Loader2 size={16} className="animate-spin text-primary" />}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[440px] animate-pulse rounded-card bg-surface" />
            ))}
          </div>
        ) : isError ? (
          <div className="card p-8 text-center">
            <p className="font-display font-bold">Không tải được chợ truyện 😢</p>
            <button onClick={() => refetch()} className="btn-primary mt-4">
              Thử lại
            </button>
          </div>
        ) : data.items.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 p-10 text-center">
            <SearchX size={36} className="text-primary" />
            <p className="font-display font-bold">Chưa có truyện phù hợp với bộ lọc</p>
            <button onClick={resetAll} className="btn-ghost mt-2 py-2 text-sm">
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-5 transition-opacity md:grid-cols-2 xl:grid-cols-4 ${isFetching ? "opacity-60" : ""}`}>
            {data.items.map((listing) => (
              <ListingCard key={listing.id} listing={listing} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}

        {data && data.pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onChange={setPage} />
          </div>
        )}
      </section>
    </div>
  );
}

export default MarketplacePage;
