import {
  ArrowRight,
  Baby,
  BadgeCheck,
  BookOpen,
  Brain,
  Building2,
  CameraOff,
  Check,
  ChevronsDown,
  ClipboardCheck,
  Flower2,
  Frown,
  Heart,
  Hourglass,
  Lightbulb,
  Lock,
  MonitorOff,
  PenTool,
  Scale,
  SearchCheck,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import {
  AUDIENCES,
  CASEL_SKILLS,
  MISSION_PILLARS,
  PRINCIPLES,
  FAQS,
  STEPS,
  WORKFLOW,
} from "../../constants/landingContent";

const ICONS = {
  sad: Frown, tvOff: MonitorOff, hourglass: Hourglass, verified: BadgeCheck, lightbulb: Lightbulb, family: Users,
  check: ClipboardCheck, noCamera: CameraOff, lock: Lock, brain: Brain, calm: Flower2, heart: Heart, users: Users,
  scale: Scale, search: SearchCheck, tune: SlidersHorizontal, book: BookOpen, baby: Baby, pen: PenTool, school2: Building2,
};

// Tông màu dùng chung: nền icon / chữ nhấn / nền nhạt
const TONES = {
  primary: { icon: "bg-primary-tint text-primary-dark", text: "text-primary-dark", soft: "bg-primary-tint/70", solid: "bg-primary text-white" },
  secondary: { icon: "bg-secondary-tint text-secondary-dark", text: "text-secondary-dark", soft: "bg-secondary-tint/70", solid: "bg-secondary text-white" },
  navy: { icon: "bg-navy-tint text-navy-soft", text: "text-navy-soft", soft: "bg-navy-tint/70", solid: "bg-navy-soft text-white" },
  neutral: { icon: "bg-outline text-navy/60", text: "text-navy/60" },
  danger: { icon: "bg-danger-tint text-danger-dark", text: "text-danger" },
  muted: { text: "text-navy/50" },
};

export function SectionHeader({ eyebrow, eyebrowTone = "primary", title, desc }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 text-center">
      <span className={`text-sm font-extrabold tracking-wider uppercase ${TONES[eyebrowTone].text}`}>{eyebrow}</span>
      <h2 className="text-3xl leading-tight sm:text-[32px]">{title}</h2>
      {desc && <p className="text-lg text-navy/70">{desc}</p>}
    </div>
  );
}

export function MissionSection() {
  return (
    <section id="gioi-thieu" className="w-full scroll-mt-20 bg-surface py-16">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 md:px-8">
        <SectionHeader
          eyebrow="Vì sao có StoryWeaver"
          title="Biến giờ nghe truyện thành lúc con học hiểu cảm xúc"
          desc="Mỗi truyện xoay quanh một tình huống thật của bé và một bài học cảm xúc. Bé không chỉ nghe — bé được hỏi, được chọn và được nghe điều xảy ra tiếp theo."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {MISSION_PILLARS.map((p) => {
            const Icon = ICONS[p.icon];
            const SolutionIcon = ICONS[p.solutionIcon];
            return (
              <article key={p.title} className="flex flex-col justify-between gap-5 rounded-stage bg-white p-6 shadow-mid transition hover:shadow-high">
                <div className="flex flex-col gap-3">
                  <span className={`grid h-12 w-12 place-items-center rounded-full ${TONES[p.iconTone].icon}`}>
                    <Icon size={26} />
                  </span>
                  <span className={`text-xs font-extrabold tracking-wide uppercase ${TONES[p.eyebrowTone].text}`}>{p.eyebrow}</span>
                  <h3 className="text-xl">{p.title}</h3>
                  <p className="text-navy/70">{p.problem}</p>
                </div>
                <div className={`flex flex-col gap-1.5 rounded-card p-4 ${TONES[p.solutionTone].soft}`}>
                  <span className={`flex items-center gap-1.5 text-sm font-bold ${TONES[p.solutionTone].text}`}>
                    <SolutionIcon size={18} /> Giải pháp StoryWeaver:
                  </span>
                  <p className="text-sm font-semibold">{p.solution}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PrinciplesSection() {
  return (
    <section id="cach-hoat-dong" className="mx-auto w-full max-w-[1440px] scroll-mt-20 px-4 py-16 md:px-8">
      <div className="relative overflow-hidden rounded-[3rem] bg-white p-6 shadow-high sm:p-10">
        <div className="pointer-events-none absolute top-0 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-6">
            <span className="w-fit rounded-full bg-primary-tint px-4 py-1 text-xs font-bold text-primary-dark">Nguyên tắc Vàng Về Đạo Đức AI</span>
            <h2 className="text-3xl leading-tight">“AI gợi ý – Con người quyết định – Hệ thống thực thi”</h2>
            <p className="text-lg text-navy/70">
              Chúng tôi tin rằng công nghệ chỉ là người phụ tá đắc lực, không bao giờ thay thế tình cảm và sự định hướng thiêng liêng của cha mẹ đối với
              con cái.
            </p>
            <ul className="flex flex-col gap-4 pt-1">
              {PRINCIPLES.map((p) => {
                const Icon = ICONS[p.icon];
                return (
                  <li key={p.title} className="flex items-start gap-3">
                    <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${TONES[p.tone].icon}`}>
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="font-bold">{p.title}</p>
                      <p className="text-sm text-navy/65">{p.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <ol className="flex flex-col gap-2 rounded-stage bg-surface p-5 shadow-low sm:p-6 lg:col-span-6" aria-label="Quy trình 3 bước">
            {WORKFLOW.map((w, i) => (
              <li key={w.title} className="flex flex-col items-center gap-2">
                <div className="flex w-full items-center gap-4 rounded-card bg-white p-4 shadow-low">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-lg font-bold ${TONES[w.tone].solid}`}>{i + 1}</span>
                  <div>
                    <p className="font-bold">{w.title}</p>
                    <p className="text-sm text-navy/65">{w.desc}</p>
                  </div>
                </div>
                {i < WORKFLOW.length - 1 && <ChevronsDown size={24} className={TONES[w.tone].text} aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function CaselSection() {
  return (
    <section id="mo-hinh-casel" className="w-full scroll-mt-20 bg-surface py-16">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 md:px-8">
        <SectionHeader
          eyebrow="Khung sư phạm"
          eyebrowTone="secondary"
          title="5 năng lực cảm xúc – xã hội theo khung CASEL"
          desc="Mỗi bài học gắn một năng lực. Câu trả lời của bé ở từng truyện được cộng vào đúng năng lực đó trong Báo cáo EQ."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          {CASEL_SKILLS.map((s) => {
            const Icon = ICONS[s.icon];
            const t = TONES[s.tone];
            return (
              <article key={s.en} className="flex flex-col justify-between rounded-stage bg-white p-5 shadow-low transition hover:-translate-y-1 hover:shadow-high">
                <div className="flex flex-col gap-2">
                  <span className={`grid h-10 w-10 place-items-center rounded-full ${t.icon}`}>
                    <Icon size={20} />
                  </span>
                  <h3 className="text-xl">{s.title}</h3>
                  <span className={`text-xs font-bold ${t.text}`}>{s.en}</span>
                  <p className="text-sm text-navy/65">{s.desc}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function StepsSection() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-16 md:px-8">
      <div className="flex flex-col gap-10">
        <SectionHeader
          eyebrow="Cách hoạt động"
          title="3 bước để có một truyện riêng cho con"
          desc="Ba mẹ kể tình huống, AI viết giúp trong vài phút, ba mẹ xem lại — rồi đưa lên giá sách cho bé nghe."
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {STEPS.map((s, i) => {
            const Icon = ICONS[s.icon];
            const t = TONES[s.tone];
            return (
              <article key={s.title} className="flex flex-col gap-4 rounded-[2rem] bg-white p-6 shadow-mid">
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-4 py-1 font-display font-bold ${t.icon}`}>Bước {String(i + 1).padStart(2, "0")}</span>
                  <Icon size={28} className={t.text} />
                </div>
                <div className={`relative grid h-44 place-items-center overflow-hidden rounded-card bg-gradient-to-br ${s.gradient}`} aria-hidden="true">
                  <span className="text-7xl drop-shadow-lg">{s.scene[0]}</span>
                  <span className="absolute top-5 left-8 text-4xl">{s.scene[1]}</span>
                  <span className="absolute right-8 bottom-5 text-4xl">{s.scene[2]}</span>
                </div>
                <h3 className="text-xl">{s.title}</h3>
                <p className="text-navy/70">{s.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AudienceSection({ onCta }) {
  return (
    <section id="danh-cho-gia-dinh" className="w-full scroll-mt-20 bg-surface py-16">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 md:px-8">
        <SectionHeader
          eyebrow="Ai dùng StoryWeaver"
          eyebrowTone="secondary"
          title="Cho gia đình — và cho ba mẹ thích viết truyện"
          desc="Mọi tài khoản phụ huynh đều tạo truyện cho con. Ba mẹ nào muốn chia sẻ truyện hay có thể đăng bán trên Chợ truyện."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {AUDIENCES.map((a) => {
            const Icon = ICONS[a.icon];
            const t = TONES[a.tone];
            return (
              <article key={a.title} className="flex flex-col justify-between gap-5 rounded-[2rem] bg-white p-6 shadow-mid">
                <div className="flex flex-col gap-3">
                  <span className={`grid h-12 w-12 place-items-center rounded-full ${t.icon}`}>
                    <Icon size={24} />
                  </span>
                  <h3 className="text-xl">{a.title}</h3>
                  <p className="text-navy/70">{a.desc}</p>
                  <ul className="flex flex-col gap-1.5 pt-1">
                    {a.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-sm">
                        <Check size={18} className="shrink-0 text-secondary" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => onCta(a)} className={`inline-flex items-center gap-1.5 self-start text-sm font-bold transition hover:translate-x-1 ${t.text}`}>
                  {a.cta} <ArrowRight size={16} />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="cau-hoi" className="mx-auto w-full max-w-[1440px] scroll-mt-20 px-4 py-16 md:px-8">
      <div className="flex flex-col gap-10">
        <SectionHeader eyebrow="Câu hỏi thường gặp" title="Ba mẹ hay hỏi gì?" desc="Những điều cần biết trước khi tạo truyện đầu tiên cho con." />
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-2">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-[1.5rem] bg-white p-5 shadow-low open:shadow-mid">
              <summary className="cursor-pointer list-none font-display text-lg font-bold marker:hidden">
                <span className="flex items-start justify-between gap-3">
                  {f.q}
                  <ChevronsDown size={20} className="mt-1 shrink-0 text-primary transition group-open:rotate-180" aria-hidden="true" />
                </span>
              </summary>
              <p className="mt-3 text-navy/75">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
