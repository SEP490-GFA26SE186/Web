import { ArrowRight, Loader2, UserRound, WandSparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../constants/routes";
import SectionCard from "./SectionCard";

// characters.portrait_status (generation_status)
const PORTRAIT_STATUS = {
  none: { label: "Chưa có chân dung", className: "bg-surface text-navy/60" },
  queued: { label: "Đang chờ vẽ", className: "bg-primary-tint text-primary-dark", spinning: true },
  generating: { label: "AI đang vẽ", className: "bg-primary-tint text-primary-dark", spinning: true },
  ready: { label: "Đã chọn chân dung", className: "bg-secondary-tint text-secondary-dark" },
  failed: { label: "Vẽ thất bại", className: "bg-danger-tint text-danger-dark" },
};

/**
 * Nhân vật đại diện của bé (characters.child_id — mỗi bé tối đa 1 nhân vật).
 * Ngoại hình chỉ mô tả bằng chữ; AI vẽ 2 chân dung để ba mẹ chọn 1 làm ảnh tham chiếu. Không upload ảnh.
 */
function CharacterCard({ child, onEdit }) {
  const character = child.character;
  const status = character && PORTRAIT_STATUS[character.portraitStatus];

  return (
    <SectionCard
      icon={UserRound}
      title="Nhân vật đại diện của bé"
      subtitle="Bé xuất hiện trong truyện với ngoại hình này"
      action={
        character && (
          <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${status.className}`}>
            {status.spinning && <Loader2 size={12} className="animate-spin" />} {status.label}
          </span>
        )
      }
    >
      {character ? (
        <div className="space-y-4">
          <div className="rounded-2xl bg-surface p-4">
            <p className="text-xs font-bold text-navy/60">Mô tả ngoại hình</p>
            <p className="mt-1 text-sm leading-relaxed">{character.appearance}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={onEdit} className="rounded-full bg-surface px-4 py-2 text-sm font-semibold transition hover:bg-outline">
              Sửa mô tả
            </button>
            <Link
              to={ROUTES.PARENT.FAMILY_CHARACTERS}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-bold text-white shadow-low transition hover:bg-secondary-dark"
            >
              <WandSparkles size={15} /> {character.portraitStatus === "ready" ? "Đổi chân dung" : "Vẽ chân dung bằng AI"}
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start gap-3 rounded-2xl bg-surface p-4">
          <p className="text-sm text-navy/70">
            Chưa có nhân vật. Thêm mô tả ngoại hình để AI vẽ {child.name} thành nhân vật chính trong truyện.
          </p>
          <button onClick={onEdit} className="inline-flex items-center gap-1 text-sm font-bold text-primary-dark hover:gap-2">
            Thêm mô tả ngoại hình <ArrowRight size={15} />
          </button>
        </div>
      )}
    </SectionCard>
  );
}

export default CharacterCard;
