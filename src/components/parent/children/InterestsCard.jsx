import { useState } from "react";
import { Palette, Plus, WandSparkles, X } from "lucide-react";
import { INTEREST_SUGGESTIONS } from "../../../mocks/childProfiles";
import SectionCard from "./SectionCard";

const MAX_INTERESTS = 10;
// Xoay vòng màu chip theo design: cam / xanh ngọc / navy nhạt
const chipTones = [
  "bg-primary-tint text-primary-dark",
  "bg-primary-tint text-primary-dark",
  "bg-secondary-tint text-secondary-dark",
  "bg-slate-100 text-navy-soft",
  "bg-secondary-tint text-secondary-dark",
];

const ageGroupOf = (age) => (age <= 3 ? "2-3" : age <= 6 ? "4-6" : "7-9");

function InterestsCard({ interests, onChange, childAge }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const add = ({ emoji = "✨", label }) => {
    const text = label.trim();
    if (!text) return;
    if (interests.some((i) => i.label.toLowerCase() === text.toLowerCase())) {
      setError("Sở thích này đã có rồi ạ");
      return;
    }
    if (interests.length >= MAX_INTERESTS) {
      setError(`Chỉ chọn tối đa ${MAX_INTERESTS} sở thích để AI tập trung hơn`);
      return;
    }
    onChange([...interests, { id: `i_${Date.now()}`, emoji, label: text }]);
    setInput("");
    setError("");
  };

  const remove = (id) => onChange(interests.filter((i) => i.id !== id));

  const suggestions = INTEREST_SUGGESTIONS[ageGroupOf(childAge)].filter(
    (s) => !interests.some((i) => i.label === s.label),
  );

  return (
    <SectionCard
      icon={WandSparkles}
      title="Thế giới & Chủ đề yêu thích"
      subtitle="AI sẽ lồng ghép các yếu tố này vào cốt truyện cá nhân hóa"
      action={
        <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-xs font-bold text-navy/60">
          {interests.length} Đã chọn
        </span>
      }
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {interests.length === 0 && (
          <p className="text-sm text-navy/50">Chưa có sở thích nào — thêm vài điều bé yêu thích nhé!</p>
        )}
        {interests.map((item, i) => (
          <span
            key={item.id}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold ${chipTones[i % chipTones.length]}`}
          >
            <span className="text-xl">{item.emoji}</span>
            {item.label}
            <button
              onClick={() => remove(item.id)}
              aria-label={`Xóa ${item.label}`}
              className="rounded-full p-0.5 opacity-60 transition hover:bg-white/60 hover:text-red-600 hover:opacity-100"
            >
              <X size={15} />
            </button>
          </span>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          add({ label: input });
        }}
        className="flex items-center gap-2 rounded-2xl bg-surface p-2 focus-within:ring-[3px] focus-within:ring-secondary/15"
      >
        <Palette size={20} className="ml-2 shrink-0 text-navy/50" />
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          maxLength={40}
          placeholder="Thêm sở thích mới (Ví dụ: Robot biến hình, Nấu ăn, Lâu đài mây...)"
          className="min-w-0 flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-navy/40"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="flex shrink-0 items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-50"
        >
          <Plus size={16} /> Thêm
        </button>
      </form>
      {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}

      {suggestions.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-navy/60">Gợi ý chủ đề bé {childAge} tuổi thích:</span>
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => add(s)}
              className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-navy/70 transition hover:bg-primary-tint hover:text-primary-dark"
            >
              + {s.label}
            </button>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

export default InterestsCard;
