import { AlertTriangle, ImageIcon, Loader2, RefreshCw } from "lucide-react";

/**
 * Tranh AI của một cảnh, đặt trên trang đầu tiên của cảnh đó (các trang cùng cảnh dùng chung tranh).
 * `queued` mà chưa có job = đang chờ vẽ chân dung nhân vật; `generating` = AI đang vẽ.
 */
function ScenePicture({ scene, pageRange, cost, onRedraw, redrawing, disabled }) {
  const drawing = scene.imageStatus === "queued" || scene.imageStatus === "generating";
  const failed = scene.imageStatus === "failed";
  const canDraw = !!scene.description?.trim();

  return (
    <figure className="card overflow-hidden">
      <div className="relative aspect-[4/3] w-full bg-surface">
        {scene.imageUrl && !drawing ? (
          <img src={scene.imageUrl} alt={`Tranh cảnh ${scene.sceneOrder}`} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center p-6 text-center text-navy/50">
            {drawing ? (
              <div className="space-y-2">
                <Loader2 size={30} className="mx-auto animate-spin text-primary" />
                <p className="text-sm font-semibold text-primary-dark">
                  {scene.imageStatus === "generating" ? "AI đang vẽ tranh… (khoảng 15–30 giây)" : "Đang chờ vẽ chân dung nhân vật trước"}
                </p>
              </div>
            ) : failed ? (
              <div className="space-y-2 text-danger">
                <AlertTriangle size={28} className="mx-auto" />
                <p className="text-sm font-semibold">Vẽ chưa được — credit đã hoàn lại</p>
              </div>
            ) : (
              <div className="space-y-2">
                <ImageIcon size={30} className="mx-auto" />
                <p className="text-sm">Cảnh này chưa có tranh</p>
              </div>
            )}
          </div>
        )}
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs text-navy/60">
        <span>
          Tranh cảnh {scene.sceneOrder} · {pageRange}
        </span>
        {canDraw && !drawing && (
          <button
            type="button"
            onClick={onRedraw}
            disabled={disabled || redrawing}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-tint px-3 py-1.5 font-bold whitespace-nowrap text-primary-dark transition hover:bg-primary hover:text-white disabled:opacity-50"
          >
            {redrawing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            {scene.imageUrl ? "Vẽ lại cảnh" : "Vẽ tranh"}
            {cost > 0 && <span className="opacity-80">· {cost} credit</span>}
          </button>
        )}
      </figcaption>
    </figure>
  );
}

export default ScenePicture;
