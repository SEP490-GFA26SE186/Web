import { AlertTriangle, Loader2, UserRound, WandSparkles } from "lucide-react";
import { useAiPricing, useGeneratePortrait } from "../../hooks/useStudio";
import { toast } from "../../stores/toastStore";

const DRAWING = new Set(["queued", "generating"]);

/**
 * Chân dung AI của nhân vật (1 ảnh, dùng làm ảnh tham chiếu để tranh cảnh vẽ đúng nhân vật).
 * Nút tạo / vẽ lại báo giá trước; đang vẽ thì hiện vòng xoay (danh sách nhân vật tự tải lại).
 */
function CharacterPortrait({ character, size = "md" }) {
  const generate = useGeneratePortrait();
  const { data: pricing } = useAiPricing();
  const cost = pricing?.images?.characterPortrait;
  const drawing = DRAWING.has(character.portraitStatus) || (generate.isPending && generate.variables === character.id);
  const failed = character.portraitStatus === "failed";
  const box = size === "sm" ? "h-16 w-16" : "h-24 w-24";

  const start = () =>
    generate.mutate(character.id, {
      onSuccess: () => toast.success(`Đang vẽ chân dung ${character.name}${cost ? ` — đã dùng ${cost} credit` : ""}`),
      onError: (e) => toast.error(e.status === 402 ? "Ba mẹ không đủ credit để vẽ chân dung" : e.message),
    });

  return (
    <div className="flex items-center gap-3">
      <div className={`${box} relative shrink-0 overflow-hidden rounded-2xl border border-outline bg-surface`}>
        {character.portraitImageUrl && !drawing ? (
          <img src={character.portraitImageUrl} alt={`Chân dung ${character.name}`} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-navy/30">
            {drawing ? <Loader2 size={22} className="animate-spin text-primary" /> : <UserRound size={28} />}
          </div>
        )}
      </div>
      <div className="min-w-0 space-y-1">
        {drawing ? (
          <p className="text-xs font-semibold text-primary-dark">AI đang vẽ chân dung… (khoảng 30 giây)</p>
        ) : failed ? (
          <p className="flex items-center gap-1 text-xs font-semibold text-danger">
            <AlertTriangle size={13} /> Vẽ chưa được, credit đã hoàn lại
          </p>
        ) : (
          <p className="text-xs text-navy/55">{character.portraitImageUrl ? "Tranh trong truyện vẽ theo chân dung này" : "Chưa có chân dung AI"}</p>
        )}
        {!drawing && (
          <button
            type="button"
            onClick={start}
            disabled={!character.appearance?.trim()}
            title={character.appearance?.trim() ? undefined : "Thêm mô tả ngoại hình trước"}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-tint px-3 py-1.5 text-xs font-bold whitespace-nowrap text-primary-dark transition hover:bg-primary hover:text-white disabled:opacity-50"
          >
            <WandSparkles size={14} />
            {character.portraitImageUrl ? "Vẽ lại" : "Tạo chân dung AI"}
            {cost > 0 && <span className="opacity-80">· {cost} credit</span>}
          </button>
        )}
      </div>
    </div>
  );
}

export default CharacterPortrait;
