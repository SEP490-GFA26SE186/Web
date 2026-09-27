import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, CheckCircle2, ChevronRight, GraduationCap, Pause, Play, PlayCircle, ShieldCheck, Sparkles, Star, Flower2 } from "lucide-react";
import { HERO_DEMO, TRUST_BADGES } from "../../constants/landingContent";
import { ROUTES } from "../../constants/routes";
import { speak, speechSupported, stopSpeaking } from "../../utils/speech";

const TRUST_ICONS = { star: Star, shield: ShieldCheck, school: GraduationCap };
const TRUST_TONES = { primary: "fill-primary text-primary", secondary: "text-secondary", primaryDark: "text-primary-dark" };
const CHOICE_TONES = {
  secondary: { badge: "bg-secondary-tint text-secondary-dark", hover: "group-hover:text-secondary-dark", ring: "ring-secondary" },
  primary: { badge: "bg-primary-tint text-primary-dark", hover: "group-hover:text-primary-dark", ring: "ring-primary" },
};
const WAVE = [8, 16, 20, 12, 6, 18, 22, 14, 8, 16, 10, 4];

// Khung demo tương tác thu nhỏ: nghe đọc & chọn ngã rẽ ngay trên Landing
function HeroDemo() {
  const [picked, setPicked] = useState(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => stopSpeaking, []);

  const togglePlay = () => {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
    } else {
      speak(HERO_DEMO.text, 0.9, () => setPlaying(false));
      setPlaying(true);
    }
  };

  const choice = HERO_DEMO.choices.find((c) => c.id === picked);

  return (
    <div className="relative">
      <div className="relative w-full overflow-hidden rounded-stage bg-white p-5 shadow-high sm:p-6">
        <div className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full bg-primary/15 blur-2xl" />

        <div className="relative flex items-center justify-between gap-2 pb-3">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="h-3 w-3 shrink-0 rounded-full bg-primary" />
            <span className="h-3 w-3 shrink-0 rounded-full bg-secondary" />
            <span className="h-3 w-3 shrink-0 rounded-full bg-navy-tint" />
            <span className="ml-1 truncate text-xs font-semibold text-navy/60">{HERO_DEMO.chapter}</span>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary-tint px-2.5 py-1 text-xs font-bold text-secondary-dark">
            <Brain size={14} /> {HERO_DEMO.level}
          </span>
        </div>

        <div className="relative my-1 grid h-56 w-full place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-300 via-lime-200 to-amber-100 shadow-inner">
          <span className="text-[110px] drop-shadow-xl select-none" aria-hidden="true">
            🦖
          </span>
          <span className="absolute top-6 left-8 text-5xl" aria-hidden="true">
            🌳
          </span>
          <span className="absolute right-10 bottom-16 text-4xl" aria-hidden="true">
            🧱
          </span>
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-full bg-white/90 px-3 py-1.5 shadow-mid backdrop-blur-md">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                disabled={!speechSupported()}
                aria-label={playing ? "Tạm dừng" : "Nghe thử giọng đọc"}
                className="grid h-7 w-7 place-items-center rounded-full bg-primary text-white shadow-low disabled:opacity-50"
              >
                {playing ? <Pause size={14} className="fill-white" /> : <Play size={14} className="ml-0.5 fill-white" />}
              </button>
              <div className="leading-tight">
                <p className="text-xs font-bold">{HERO_DEMO.narrator}</p>
                <p className="text-[11px] text-navy/60">{playing ? "Đang đọc…" : "Bấm để nghe thử"}</p>
              </div>
            </div>
            <svg viewBox="0 0 100 24" className="h-5 w-24 text-secondary" fill="currentColor" aria-hidden="true">
              {WAVE.map((h, i) => (
                <rect key={i} x={i * 8} y={12 - h / 2} width="4" height={h} rx="2" className={playing ? "animate-pulse" : "opacity-60"} style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </svg>
          </div>
        </div>

        <p className="mt-2 rounded-2xl bg-surface p-3 leading-relaxed">“{HERO_DEMO.text}”</p>

        <div className="mt-3 flex flex-col gap-2">
          {HERO_DEMO.choices.map((c) => {
            const t = CHOICE_TONES[c.tone];
            const selected = picked === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setPicked(c.id)}
                aria-pressed={selected}
                className={`group flex items-center justify-between gap-3 rounded-2xl p-3 text-left shadow-low transition ${
                  selected ? `bg-white ring-2 ${t.ring}` : "bg-surface hover:bg-outline/60"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-sm font-bold ${t.badge}`}>{c.id}</span>
                  <span className={`text-sm font-semibold transition-colors ${t.hover}`}>{c.text}</span>
                </span>
                {selected ? <CheckCircle2 size={18} className="shrink-0 text-secondary" /> : <ChevronRight size={18} className="shrink-0 text-navy/40" />}
              </button>
            );
          })}
          {choice && (
            <p role="status" className="rounded-2xl bg-secondary-tint p-3 text-sm font-semibold text-secondary-dark">
              {choice.feedback}
            </p>
          )}
        </div>
      </div>

      <div className="absolute -bottom-4 -left-2 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-high sm:-left-4">
        <Flower2 size={20} className="text-secondary" />
        <span className="text-xs font-bold">{HERO_DEMO.skillBadge}</span>
      </div>
    </div>
  );
}

function HeroSection({ onSignupClick }) {
  return (
    <section className="relative mx-auto w-full max-w-[1440px] px-4 pt-8 pb-14 md:px-8">
      <div className="pointer-events-none absolute -top-12 left-1/4 -z-10 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute top-48 right-10 -z-10 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-5 lg:col-span-7">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-outline/60 px-4 py-1.5 shadow-low">
            <Sparkles size={17} className="shrink-0 text-primary" />
            <span className="text-xs font-bold text-primary-dark">Nền tảng Giáo dục Cảm xúc CASEL & Truyện AI tương tác đầu tiên tại Việt Nam</span>
          </span>
          <h1 className="text-4xl leading-tight tracking-tight sm:text-5xl">
            Cùng con nuôi dưỡng <br />
            <span className="text-primary">Trí tuệ Cảm xúc</span> <br />
            qua từng trang truyện diệu kỳ
          </h1>
          <p className="max-w-xl text-lg text-navy/70 sm:text-xl">
            StoryWeaver AI đồng hành cùng cha mẹ kiến tạo những câu chuyện tương tác cá nhân hóa, giúp trẻ 5–8 tuổi thấu hiểu cảm xúc, rèn luyện kỹ năng
            giải quyết tình huống và gắn kết gia đình bền chặt.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button onClick={onSignupClick} className="btn-primary px-8 py-4 font-display text-lg shadow-mid hover:shadow-high">
              Khám phá miễn phí ngay <ArrowRight size={22} />
            </button>
            <Link
              to={ROUTES.KID.story("s_101")}
              className="inline-flex items-center gap-2 rounded-full bg-surface px-6 py-4 font-bold text-secondary-dark transition hover:bg-secondary-tint"
            >
              <PlayCircle size={22} /> Trải nghiệm Kid Mode (1 phút)
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-2 pt-3 sm:grid-cols-3">
            {TRUST_BADGES.map((b) => {
              const Icon = TRUST_ICONS[b.icon];
              return (
                <div key={b.title} className="flex items-center gap-2 rounded-2xl bg-surface p-3 shadow-low">
                  <Icon size={22} className={`shrink-0 ${TRUST_TONES[b.tone]}`} />
                  <div className="leading-tight">
                    <p className="text-sm font-bold">{b.title}</p>
                    <p className="text-xs text-navy/60">{b.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5">
          <HeroDemo />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
