import { Check, ImageIcon, Loader2, RotateCcw } from "lucide-react";
import { useSetStoryCover } from "../../../hooks/useStudio";
import { toast } from "../../../stores/toastStore";
import { coverOf } from "../library/storyMeta";
import StoryCover from "../StoryCover";

const DRAWING = new Set(["queued", "generating"]);

/**
 * Ảnh bìa của truyện riêng: chọn tranh một cảnh làm bìa (PUT /stories/:id/cover).
 * "Dùng ảnh mặc định" gửi sceneId = null → BE lấy tranh cảnh 1; chưa có tranh thì bìa vẽ theo màu năng lực.
 */
function CoverPicker({ story, disabled }) {
  const setCover = useSetStoryCover(story.id);
  const cover = coverOf(story);
  const scenes = (story.scenes ?? []).filter((s) => s.imageUrl && !DRAWING.has(s.imageStatus)).sort((a, b) => a.sceneOrder - b.sceneOrder);
  const drawing = (story.scenes ?? []).some((s) => DRAWING.has(s.imageStatus));
  // coverSceneId: cảnh đang làm bìa (null = mặc định). BE chưa trả thì đoán theo ảnh đang dùng.
  const selectedId = story.coverSceneId !== undefined ? story.coverSceneId : (scenes.find((s) => s.imageUrl === cover.imageUrl)?.id ?? null);
  const pendingId = setCover.isPending ? setCover.variables : undefined;

  const choose = (sceneId) => {
    if (sceneId === selectedId) return;
    setCover.mutate(sceneId, {
      onSuccess: () => toast.success(sceneId ? "Đã đổi ảnh bìa" : "Đã dùng ảnh bìa mặc định"),
      onError: (err) => toast.error(err.status === 422 ? err.message || "Cảnh này chưa có tranh để làm bìa" : err.message),
    });
  };

  return (
    <section className="card space-y-4 p-5">
      <div>
        <h2 className="flex items-center gap-2 text-lg">
          <ImageIcon size={20} className="text-primary" /> Ảnh bìa
        </h2>
        <p className="mt-1 text-sm text-navy/60">
          Bìa dùng tranh của một cảnh trong truyện (mặc định là cảnh 1). Tên truyện luôn hiện trên bìa.
        </p>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <StoryCover cover={cover} title={story.title} showTitle className="aspect-square w-full shrink-0 rounded-2xl shadow-low sm:w-44" />

        <div className="min-w-0 flex-1 space-y-3">
          {scenes.length > 0 ? (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {scenes.map((scene) => {
                const selected = scene.id === selectedId;
                return (
                  <li key={scene.id}>
                    <button
                      type="button"
                      onClick={() => choose(scene.id)}
                      disabled={disabled || setCover.isPending}
                      aria-pressed={selected}
                      aria-label={`Dùng tranh cảnh ${scene.sceneOrder} làm bìa`}
                      className={`relative block aspect-square w-full overflow-hidden rounded-xl border-2 transition disabled:opacity-60 ${
                        selected ? "border-primary shadow-mid" : "border-outline hover:border-primary/60"
                      }`}
                    >
                      <img src={scene.imageUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                      <span className="absolute bottom-1 left-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold text-navy">
                        Cảnh {scene.sceneOrder}
                      </span>
                      {selected && (
                        <span className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-primary text-white">
                          <Check size={14} />
                        </span>
                      )}
                      {pendingId === scene.id && (
                        <span className="absolute inset-0 grid place-items-center bg-white/60">
                          <Loader2 size={20} className="animate-spin text-primary" />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="rounded-2xl bg-surface px-4 py-3 text-sm text-navy/65">
              {drawing
                ? "Tranh đang được vẽ — xong là chọn được ảnh bìa."
                : "Truyện chưa có tranh nên bìa dùng màu theo năng lực của bài học."}
            </p>
          )}
          {drawing && scenes.length > 0 && <p className="text-xs text-navy/50">Còn cảnh đang vẽ — tranh mới sẽ hiện ở đây khi xong.</p>}

          {scenes.length > 0 && (
            <button
              type="button"
              onClick={() => choose(null)}
              disabled={disabled || setCover.isPending || selectedId === null}
              aria-pressed={selectedId === null}
              className="btn-ghost px-4 py-2 text-sm disabled:opacity-60"
            >
              {pendingId === null ? <Loader2 size={16} className="animate-spin" /> : selectedId === null ? <Check size={16} /> : <RotateCcw size={16} />}
              {selectedId === null ? "Đang dùng ảnh mặc định" : "Dùng ảnh mặc định"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default CoverPicker;
