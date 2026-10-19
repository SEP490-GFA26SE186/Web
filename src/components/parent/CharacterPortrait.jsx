import { AlertTriangle, Loader2, UserRound, WandSparkles } from "lucide-react";
import { useAiPricing, useGeneratePortrait } from "../../hooks/useStudio";
import { toast } from "../../stores/toastStore";

const DRAWING = new Set(["queued", "generating"]);

/**
 * Chân dung AI của nhân vật (1 ảnh, dùng làm ảnh tham chiếu để tranh cảnh vẽ đúng nhân vật).
 * Nút tạo / vẽ lại báo giá trước; đang vẽ thì hiện vòng xoay (danh sách nhân vật tự tải lại).
 */
function CharacterPortrait({ character, size = "full" }) {
  const generate = useGeneratePortrait();
  const { data: pricing } = useAiPricing();
  const cost = pricing?.images?.characterPortrait;
  const drawing = DRAWING.has(character.portraitStatus) || (generate.isPending && generate.variables === character.id);
  const failed = character.portraitStatus === "failed";
  const full = size === "full";
  // full: ảnh chiếm hết chiều ngang thẻ (vuông, như ảnh gốc 496x496); sm: ô nhỏ cạnh chữ
  const box = full ? "aspect-square w-full" : "h-16 w-16";

  const start = () =>
    generate.mutate(character.id, {
      onSuccess: () => toast.success(`Đang vẽ chân dung ${character.name}${cost ? ` — đã dùng ${cost} credit` : ""}`),
      onError: (e) => toast.error(e.status === 402 ? "Ba mẹ không đủ credit để vẽ chân dung" : e.message),
    });

  return (
    <div className={full ? "flex flex-col gap-3" : "flex items-center gap-3"}>
      <div className={`${box} relative shrink-0 overflow-hidden rounded-2xl border border-outline bg-white`}>
        {character.portraitImageUrl && !drawing ? (
          <a href={character.portraitImageUrl} target="_blank" rel="noreferrer" title="Mở ảnh gốc" className="block h-full w-full">
            <img src={character.portraitImageUrl} alt={`Chân dung ${character.name}`} className="h-full w-full object-contain" />
          </a>
        ) : (
          <div className="grid h-full w-full place-items-center bg-surface text-navy/30">
            {drawing ? <Loader2 size={full ? 36 : 22} className="animate-spin text-primary" /> : <UserRound size={full ? 56 : 28} />}
          </div>
        )}
      </div>
      <div className={`min-w-0 space-y-1 ${full ? "flex flex-wrap items-center justify-between gap-2" : ""}`}>
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
