import { ArrowRight, CheckCircle2, Flower2, Loader2, Sparkles, Users, Volume2 } from "lucide-react";
import useKidStore from "../../stores/kidStore";
import { toast } from "../../stores/toastStore";
import { speak } from "../../utils/speech";

const TONES = {
  secondary: {
    card: "hover:bg-secondary-tint/60",
    selected: "bg-secondary-tint ring-4 ring-secondary/40",
    avatar: "bg-secondary-tint",
    tag: "bg-secondary-tint text-secondary-dark",
    text: "text-secondary-dark",
    title: "group-hover:text-secondary-dark",
    button: "bg-secondary",
  },
  primary: {
    card: "hover:bg-primary-tint/70",
    selected: "bg-primary-tint ring-4 ring-primary/40",
    avatar: "bg-primary-tint",
    tag: "bg-primary-tint text-primary-dark",
    text: "text-primary-dark",
    title: "group-hover:text-primary-dark",
    button: "bg-primary",
  },
};
const SKILL_ICONS = { groups: Users, spa: Flower2 };

function DecisionPoint({ decision, childName, chosenId, onChoose, pendingId, shake }) {
  const { muted, rate } = useKidStore();
  const question = decision.question.replace("{name}", childName);
  const locked = !!chosenId;

  const listen = (e, text) => {
    e.stopPropagation();
    if (muted) return toast.info("Bé bật loa ở góc trên để nghe nhé 🔈");
    speak(text, rate);
  };

  return (
    <section
      className={`relative overflow-hidden rounded-stage bg-gradient-to-br from-surface via-white to-surface p-6 shadow-mid sm:p-8 ${
        shake ? "animate-[wiggle_0.4s_ease-in-out_2]" : ""
      }`}
    >
      <div className="pointer-events-none absolute -top-16 -right-16 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative mx-auto mb-6 max-w-2xl text-center">
        <span className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary-dark">
          <Sparkles size={18} className="fill-primary text-primary" /> Điểm rẽ diệu kỳ <Sparkles size={18} className="fill-primary text-primary" />
        </span>
        <h3 className="text-2xl sm:text-3xl">{question}</h3>
        <p className="mt-1 text-navy/70">{locked ? "Con đã chọn rồi, cùng đọc tiếp xem chuyện gì xảy ra nhé!" : decision.hint}</p>
      </div>

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
        {decision.choices.map((c, i) => {
          const t = TONES[c.tone];
          const SkillIcon = SKILL_ICONS[c.skillIcon] ?? Sparkles;
          const selected = chosenId === c.id;
          const dimmed = locked && !selected;
          return (
            <div
              key={c.id}
              role="button"
              tabIndex={locked ? -1 : 0}
              aria-pressed={selected}
              aria-disabled={locked}
              onClick={() => !locked && !pendingId && onChoose(c)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !locked && !pendingId && onChoose(c)}
              className={`group relative flex flex-col justify-between rounded-stage p-5 shadow-mid transition duration-300 sm:p-6 ${
                selected ? t.selected : dimmed ? "bg-white opacity-50" : `cursor-pointer bg-white hover:-translate-y-1.5 ${t.card}`
              }`}
            >
              {selected && (
                <span className={`absolute -top-3 right-5 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white shadow-mid ${t.button}`}>
                  <CheckCircle2 size={14} /> Bé đã chọn
                </span>
              )}
              <div className="flex items-start gap-4">
                <span className={`grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-4xl shadow-inner transition group-hover:scale-105 ${t.avatar}`}>
                  {c.emoji}
                </span>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${t.tag}`}>
                      <SkillIcon size={14} /> {c.skill}
                    </span>
                    <span className={`text-sm font-bold ${t.text}`}>+{c.stars} ⭐</span>
                  </div>
                  <h4 className={`text-lg leading-snug transition-colors sm:text-xl ${t.title}`}>{c.title}</h4>
                  <p className="mt-1.5 text-sm text-navy/65">{c.desc}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between pt-3">
                <button onClick={(e) => listen(e, `${c.title}. ${c.desc}`)} className={`flex items-center gap-1.5 text-sm font-bold hover:underline ${t.text}`}>
                  <Volume2 size={20} /> Nghe lựa chọn {String.fromCharCode(65 + i)}
                </button>
                <span className={`grid h-10 w-10 place-items-center rounded-full text-white shadow-low ${t.button}`}>
                  {pendingId === c.id ? <Loader2 size={22} className="animate-spin" /> : <ArrowRight size={24} />}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default DecisionPoint;
