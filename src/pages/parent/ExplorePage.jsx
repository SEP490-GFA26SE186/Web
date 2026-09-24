import { useRef, useState } from "react";
import { ArrowRight, Loader2, SearchX, Star } from "lucide-react";
import CategoryPills from "../../components/parent/explore/CategoryPills";
import ExploreHero from "../../components/parent/explore/ExploreHero";
import LearningMethodBanner from "../../components/parent/explore/LearningMethodBanner";
import PersonalizedSection from "../../components/parent/explore/PersonalizedSection";
import PopularStoryCard from "../../components/parent/explore/PopularStoryCard";
import { useExploreOverview, usePersonalizedStories, usePopularStories } from "../../hooks/useExplore";
import { useChildren } from "../../hooks/useParent";
import useParentStore from "../../stores/parentStore";

function ExplorePage() {
  const [category, setCategory] = useState("all");
  const topicsRef = useRef(null);

  const selectedChildId = useParentStore((s) => s.selectedChildId);
  const { data: children = [] } = useChildren();
  const child = children.find((c) => c.id === selectedChildId);

  const { data: overview } = useExploreOverview();
  const popular = usePopularStories(category);
  const personalized = usePersonalizedStories(selectedChildId);

  const categoryLabel = overview?.categories.find((c) => c.id === category)?.label;

  return (
    <div className="space-y-12">
      <ExploreHero
        stats={overview?.stats}
        onBrowseTopics={() => topicsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
      />

      <div ref={topicsRef} className="scroll-mt-24">
        {overview ? (
          <CategoryPills categories={overview.categories} value={category} onChange={setCategory} />
        ) : (
          <div className="h-24 animate-pulse rounded-card bg-surface" />
        )}
      </div>

      {/* Được yêu thích nhất tháng */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-2xl">
              <Star size={24} className="fill-primary text-primary" />
              {category === "all" ? "Được các mẹ yêu thích nhất tháng này ⭐" : `Nổi bật: ${categoryLabel}`}
              {popular.isFetching && !popular.isLoading && <Loader2 size={18} className="animate-spin text-primary" />}
            </h2>
            <p className="mt-1 text-navy/70">
              Top truyện tương tác mang lại chuyển biến tích cực rõ nét trong hành vi của bé
            </p>
          </div>
          {popular.data?.total > 0 && (
            <a href="#" className="inline-flex items-center gap-1 text-sm font-bold text-primary-dark hover:text-primary">
              Xem tất cả ({popular.data.total} truyện) <ArrowRight size={16} />
            </a>
          )}
        </div>

        {popular.isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[470px] animate-pulse rounded-card bg-surface" />
            ))}
          </div>
        ) : popular.data?.items.length ? (
          <div
            className={`grid grid-cols-1 gap-5 transition-opacity md:grid-cols-2 xl:grid-cols-4 ${
              popular.isFetching ? "opacity-60" : ""
            }`}
          >
            {popular.data.items.map((story) => (
              <PopularStoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="card flex flex-col items-center gap-2 p-10 text-center">
            <SearchX size={36} className="text-primary" />
            <p className="font-display font-bold">Chủ đề này đang được Cú Weaver bổ sung truyện mới</p>
            <button onClick={() => setCategory("all")} className="btn-ghost mt-2 py-2 text-sm">
              Xem tất cả chủ đề
            </button>
          </div>
        )}
      </section>

      {child && <PersonalizedSection child={child} data={personalized.data} isLoading={personalized.isLoading} />}

      <LearningMethodBanner />
    </div>
  );
}

export default ExplorePage;
