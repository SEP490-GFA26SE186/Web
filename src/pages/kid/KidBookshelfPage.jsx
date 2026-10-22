import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, Loader2 } from "lucide-react";
import StoryCover from "../../components/parent/StoryCover";
import { coverOf } from "../../components/parent/library/storyMeta";
import { ROUTES } from "../../constants/routes";
import { useKidShelf } from "../../hooks/useKid";
import useKidSessionStore from "../../stores/kidSessionStore";

// Tủ sách của bé (GET /kid/bookshelf): chỉ truyện ba mẹ đã hoàn tất và đủ giọng đọc
function KidBookshelfPage() {
  const child = useKidSessionStore((s) => s.child);
  const { data: items = [], isLoading, error } = useKidShelf();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl">Tủ sách của {child?.name ?? "bé"} 📚</h1>
      <p className="mt-1 text-navy/60">Chọn một truyện để đọc nhé!</p>

      {isLoading && (
        <div className="grid place-items-center py-20">
          <Loader2 size={36} className="animate-spin text-primary" />
        </div>
      )}
      {error && <p className="card mt-6 p-6 text-danger">Chưa mở được tủ sách. Bé nhờ ba mẹ thử lại nhé.</p>}
      {!isLoading && !error && items.length === 0 && (
        <div className="card mt-8 flex flex-col items-center gap-3 p-10 text-center">
          <BookOpen size={44} className="text-primary" />
          <p className="font-display text-lg font-bold">Tủ sách còn trống</p>
          <p className="text-navy/60">Ba mẹ đưa truyện lên tủ sách cho bé ở trang sáng tác truyện nhé.</p>
        </div>
      )}

      <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const progress = item.readingProgress;
          return (
            <li key={item.storyId}>
              <Link
                to={ROUTES.KID.story(item.storyId)}
                className="group block overflow-hidden rounded-stage bg-white shadow-low transition hover:-translate-y-1 hover:shadow-mid"
              >
                <StoryCover cover={coverOf(item)} title={item.title} showTitle zoomOnHover className="aspect-square w-full" />
                <div className="space-y-2 p-5">
                  {progress?.isCompleted ? (
                    <p className="flex items-center gap-1 text-sm font-bold text-secondary-dark">
                      <CheckCircle2 size={16} /> Đã đọc xong — đọc lại nhé!
                    </p>
                  ) : progress ? (
                    <>
                      <div className="h-2 overflow-hidden rounded-full bg-outline">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${progress.progressPercentage}%` }} />
                      </div>
                      <p className="text-sm text-navy/60">Đang đọc trang {progress.currentPageOrder}/{item.totalPages}</p>
                    </>
                  ) : (
                    <p className="text-sm text-navy/60">{item.totalPages} trang • Truyện mới</p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default KidBookshelfPage;
