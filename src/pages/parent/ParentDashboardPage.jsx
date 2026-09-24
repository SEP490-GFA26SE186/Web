import { ChevronRight, ClipboardCheck, Library, Medal, Target, Timer, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import BedtimeCard from "../../components/parent/BedtimeCard";
import ContinueReadingCard from "../../components/parent/ContinueReadingCard";
import EqRadarCard from "../../components/parent/EqRadarCard";
import DraftReviewCard from "../../components/parent/DraftReviewCard";
import StatCard from "../../components/parent/StatCard";
import StoryRecommendationCard from "../../components/parent/StoryRecommendationCard";
import { ROUTES } from "../../constants/routes";
import { useChildren, useParentDashboard, useParentProfile } from "../../hooks/useParent";
import useParentStore from "../../stores/parentStore";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 11) return "Chào buổi sáng";
  if (h < 14) return "Chào buổi trưa";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
};

function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-16 w-2/3 rounded-2xl bg-surface" />
      <div className="h-72 rounded-stage bg-surface" />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-card bg-surface" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="h-[520px] rounded-card bg-surface xl:col-span-7" />
        <div className="h-[520px] rounded-card bg-surface xl:col-span-5" />
      </div>
    </div>
  );
}

function ParentDashboardPage() {
  const selectedChildId = useParentStore((s) => s.selectedChildId);
  const { data: parent } = useParentProfile();
  const { data: children = [] } = useChildren();
  const { data, isLoading, isError, refetch } = useParentDashboard(selectedChildId);
  const child = children.find((c) => c.id === selectedChildId);

  if (isLoading || !child || !parent) return <DashboardSkeleton />;

  if (isError || !data) {
    return (
      <div className="card mx-auto mt-20 max-w-md p-8 text-center">
        <p className="font-display text-lg font-bold">Ôi, có lỗi xảy ra rồi 😢</p>
        <button onClick={() => refetch()} className="btn-primary mt-4">
          Thử lại
        </button>
      </div>
    );
  }

  const { todaySummary, continueReading, stats, eqRadar, draftReview, bedtime, recommendations } = data;
  // "Mẹ Lan Hương" → "Mẹ", dùng cho các câu như "Cần Mẹ duyệt"
  const parentTitle = parent.name.split(" ")[0];

  return (
    <div className="space-y-8">
      {/* Lời chào */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-[34px]">
            {getGreeting()}, {parent.name}! 👋
          </h1>
          <p className="mt-2 text-navy/70">
            Hôm nay {child.name} đã hoàn thành {todaySummary.completedStories} câu chuyện về {todaySummary.topic} và
            kiếm được{" "}
            <span className="font-bold text-primary">+{todaySummary.earnedStars} Sao Yêu Thương</span>.
          </p>
        </div>
        <div className="hidden items-center gap-3 rounded-full border border-outline bg-white py-2 pr-5 pl-2 shadow-low md:flex">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary-tint text-xl">
            {child.avatarEmoji}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold">
              {child.name} • {child.age} tuổi
            </p>
            <p className="text-xs text-secondary-dark">{stats.loveStars} Sao Yêu Thương ⭐</p>
          </div>
        </div>
      </div>

      <ContinueReadingCard story={continueReading} />

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Timer}
          tone="orange"
          label="Thời gian đọc hôm nay"
          value={`${stats.readingMinutesToday} phút`}
          hint={
            <span className="inline-flex items-center gap-1">
              <TrendingUp size={12} /> +{stats.readingDeltaMinutes}m so với hôm qua
            </span>
          }
        />
        <StatCard
          icon={Library}
          tone="teal"
          label="Truyện đã hoàn thành"
          value={`${stats.completedBooks} cuốn`}
          hint="Vượt mốc tuần này 🎯"
          hintClassName="text-navy/60"
        />
        <StatCard
          icon={ClipboardCheck}
          tone="navy"
          label="Bản thảo cần duyệt"
          value={`${stats.pendingDrafts} truyện`}
          hint={stats.pendingDrafts ? `Cần ${parentTitle} duyệt trước khi đọc ✨` : "Đã duyệt hết 🎉"}
          hintClassName="text-primary-dark"
        />
        <StatCard
          icon={Medal}
          tone="orange"
          label="Sao Yêu Thương"
          value={`${stats.loveStars} sao`}
          hint="Có thể đổi quà tặng 🎁"
        />
      </div>

      {/* EQ + Bản thảo cần duyệt */}
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <EqRadarCard childName={child.name} eq={eqRadar} />
        </div>
        <div className="flex flex-col gap-4 xl:col-span-5">
          <DraftReviewCard draft={draftReview} parentTitle={parentTitle} />
          <BedtimeCard childId={selectedChildId} bedtime={bedtime} />
        </div>
      </div>

      {/* Gợi ý truyện */}
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl">Gợi ý cho {child.name} tối nay ✨</h2>
            <p className="mt-1 text-sm text-navy/60">
              Lựa chọn dựa theo khung giờ đi ngủ và xu hướng phát triển tuần này
            </p>
          </div>
          <Link
            to={ROUTES.PARENT.LIBRARY}
            className="inline-flex items-center gap-1 text-sm font-bold text-primary-dark hover:text-primary"
          >
            Xem toàn bộ tủ sách <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {recommendations.map((story) => (
            <StoryRecommendationCard key={story.id} story={story} />
          ))}
        </div>
      </section>

      <p className="flex items-center justify-center gap-1.5 pb-4 text-xs text-navy/40">
        <Target size={12} /> Dữ liệu minh họa (mock) — sẽ được thay bằng API thật
      </p>
    </div>
  );
}

export default ParentDashboardPage;
