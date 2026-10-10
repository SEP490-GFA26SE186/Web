import { useState } from "react";
import { ChevronRight, LayoutGrid, List, Loader2, SearchX } from "lucide-react";
import Pagination from "../../components/common/Pagination";
import NoChildState from "../../components/parent/NoChildState";
import ContinueReadingItem from "../../components/parent/library/ContinueReadingItem";
import LibraryHero from "../../components/parent/library/LibraryHero";
import LibraryStoryCard from "../../components/parent/library/LibraryStoryCard";
import LibraryStoryRow from "../../components/parent/library/LibraryStoryRow";
import { useChildBookshelf, useSelectedChild } from "../../hooks/useChildProfile";
import useDebounce from "../../hooks/useDebounce";

const PAGE_SIZE = 6;

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <div key={i} className="h-[380px] animate-pulse rounded-card bg-surface" />
      ))}
    </div>
  );
}

function LibraryContent({ childId, childName }) {
  const [search, setSearch] = useState("");
  const [competency, setCompetency] = useState("all");
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const [view, setView] = useState("grid");
  const debouncedSearch = useDebounce(search);

  // GET /children/:id/bookshelf
  const { data, isLoading, isFetching, isError, refetch } = useChildBookshelf(childId, {
    search: debouncedSearch,
    competency,
    status: tab,
    page,
    limit: PAGE_SIZE,
  });

  // Mọi thay đổi bộ lọc đều quay về trang 1
  const withReset = (setter) => (value) => {
    setter(value);
    setPage(1);
  };
  const resetAll = () => {
    setSearch("");
    setCompetency("all");
    setTab("all");
    setPage(1);
  };
  const handlePage = (p) => {
    setPage(p);
    document.getElementById("library-collection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const continueReading = data?.continueReading ?? [];

  return (
    <div className="space-y-10">
      <LibraryHero
        childName={childName}
        counts={data?.counts}
        search={search}
        onSearchChange={withReset(setSearch)}
        competency={competency}
        onCompetencyChange={withReset(setCompetency)}
        tab={tab}
        onTabChange={withReset(setTab)}
      />

      {continueReading.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-2xl">Tiếp tục đọc dở 📖</h2>
            <button
              onClick={() => withReset(setTab)("reading")}
              className="inline-flex items-center gap-0.5 text-sm font-semibold text-secondary-dark hover:underline"
            >
              Xem tất cả đang đọc <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {continueReading.slice(0, 2).map((story, i) => (
              <ContinueReadingItem key={story.storyId} story={story} accent={i % 2 ? "secondary" : "primary"} />
            ))}
          </div>
        </section>
      )}

      <section id="library-collection" className="scroll-mt-24">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl">Truyện trên giá sách</h2>
            <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-navy/70">
              {data?.pagination.total ?? "…"} Truyện
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
            <p className="font-display text-lg font-bold">Chưa có truyện phù hợp</p>
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
                  <LibraryStoryCard key={story.storyId} story={story} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {data.items.map((story) => (
                  <LibraryStoryRow key={story.storyId} story={story} />
                ))}
              </div>
            )}
          </div>
        )}

        {data && data.pagination.total > 0 && (
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-outline py-4 sm:flex-row">
            <span className="text-sm text-navy/70">
              Hiển thị <strong className="text-navy">{data.items.length}</strong> trên tổng số{" "}
              <strong className="text-navy">{data.pagination.total}</strong> truyện
            </span>
            <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onChange={handlePage} />
          </div>
        )}
      </section>
    </div>
  );
}

function LibraryPage() {
  const { child, isEmpty } = useSelectedChild();

  if (isEmpty) return <NoChildState />;
  if (!child) return <div className="h-64 animate-pulse rounded-stage bg-surface" />;

  // key theo bé để reset bộ lọc/trang khi đổi hồ sơ
  return <LibraryContent key={child.id} childId={child.id} childName={child.name} />;
}

export default LibraryPage;
