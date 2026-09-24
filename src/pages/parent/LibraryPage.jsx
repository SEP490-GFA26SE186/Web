import { useState } from "react";
import { ChevronRight, LayoutGrid, List, Loader2, SearchX } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import ContinueReadingItem from "../../components/parent/library/ContinueReadingItem";
import LibraryHero from "../../components/parent/library/LibraryHero";
import LibraryStoryCard from "../../components/parent/library/LibraryStoryCard";
import LibraryStoryRow from "../../components/parent/library/LibraryStoryRow";
import useDebounce from "../../hooks/useDebounce";
import { useLibraryStories, useLibrarySummary, useToggleFavorite } from "../../hooks/useLibrary";
import { useChildren } from "../../hooks/useParent";
import useParentStore from "../../stores/parentStore";

const PAGE_SIZE = 6;
const DEFAULT_FILTERS = { age: "all", duration: "all", topic: "all", sort: "recent" };

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <div key={i} className="h-[420px] animate-pulse rounded-card bg-surface" />
      ))}
    </div>
  );
}

function LibraryContent({ childId, childName }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const [view, setView] = useState("grid");
  const debouncedSearch = useDebounce(search);

  const { data: summary } = useLibrarySummary(childId);
  const { data, isLoading, isFetching, isError, refetch } = useLibraryStories(childId, {
    search: debouncedSearch,
    ...filters,
    tab,
    page,
    pageSize: PAGE_SIZE,
  });
  const toggleFavorite = useToggleFavorite(childId);

  const handleToggleFavorite = (story) =>
    toggleFavorite.mutate({ storyId: story.id, isFavorite: !story.isFavorite });

  // Mọi thay đổi bộ lọc đều quay về trang 1
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };
  const handleFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };
  const handleTab = (value) => {
    setTab(value);
    setPage(1);
  };
  const resetAll = () => {
    setSearch("");
    setFilters(DEFAULT_FILTERS);
    setTab("all");
    setPage(1);
  };
  const handlePage = (p) => {
    setPage(p);
    document.getElementById("library-collection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const continueReading = summary?.continueReading ?? [];

  return (
    <div className="space-y-10">
      <LibraryHero
        childName={childName}
        counts={summary?.counts}
        search={search}
        onSearchChange={handleSearch}
        filters={filters}
        onFilterChange={handleFilter}
        tab={tab}
        onTabChange={handleTab}
      />

      {continueReading.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-2xl">Tiếp tục đọc dở 📖</h2>
            <button
              onClick={() => handleTab("reading")}
              className="inline-flex items-center gap-0.5 text-sm font-semibold text-secondary-dark hover:underline"
            >
              Xem tất cả đang đọc <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {continueReading.slice(0, 2).map((story, i) => (
              <ContinueReadingItem key={story.id} story={story} accent={i % 2 ? "secondary" : "primary"} />
            ))}
          </div>
        </section>
      )}

      <section id="library-collection" className="scroll-mt-24">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl">Bộ sưu tập truyện tương tác</h2>
            <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-navy/70">
              {data?.total ?? "…"} Truyện
            </span>
            {isFetching && !isLoading && <Loader2 size={16} className="animate-spin text-primary" />}
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-1 text-xs text-navy/60">Chế độ xem:</span>
            {[
              { value: "grid", icon: LayoutGrid, label: "Dạng lưới" },
              { value: "list", icon: List, label: "Dạng danh sách" },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setView(value)}
                aria-label={label}
                aria-pressed={view === value}
                className={`rounded-full p-1.5 transition ${
                  view === value ? "bg-primary-tint text-primary" : "text-navy/60 hover:bg-surface"
                }`}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <GridSkeleton />
        ) : isError ? (
          <div className="card p-8 text-center">
            <p className="font-display font-bold">Không tải được tủ sách 😢</p>
            <button onClick={() => refetch()} className="btn-primary mt-4">
              Thử lại
            </button>
          </div>
        ) : data.items.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 p-10 text-center">
            <SearchX size={40} className="text-primary" />
            <p className="font-display text-lg font-bold">Chưa tìm thấy câu chuyện phù hợp</p>
            <p className="text-sm text-navy/60">Thử đổi từ khóa hoặc bỏ bớt bộ lọc ba mẹ nhé.</p>
            <button onClick={resetAll} className="btn-ghost mt-3 py-2 text-sm">
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className={`transition-opacity ${isFetching ? "opacity-60" : ""}`}>
            {view === "grid" ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.items.map((story) => (
                  <LibraryStoryCard key={story.id} story={story} onToggleFavorite={handleToggleFavorite} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {data.items.map((story) => (
                  <LibraryStoryRow key={story.id} story={story} onToggleFavorite={handleToggleFavorite} />
                ))}
              </div>
            )}
          </div>
        )}

        {data && data.total > 0 && (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-outline py-4 sm:flex-row">
            <span className="text-sm text-navy/70">
              Hiển thị <strong className="text-navy">{data.items.length}</strong> trên tổng số{" "}
              <strong className="text-navy">{data.total}</strong> truyện tương tác
            </span>
            <Pagination page={data.page} totalPages={data.totalPages} onChange={handlePage} />
          </div>
        )}
      </section>
    </div>
  );
}

function LibraryPage() {
  const selectedChildId = useParentStore((s) => s.selectedChildId);
  const { data: children = [] } = useChildren();
  const child = children.find((c) => c.id === selectedChildId);

  if (!child) return <div className="h-64 animate-pulse rounded-stage bg-surface" />;

  // key theo bé để reset bộ lọc/trang khi đổi hồ sơ
  return <LibraryContent key={child.id} childId={child.id} childName={child.name} />;
}

export default LibraryPage;
