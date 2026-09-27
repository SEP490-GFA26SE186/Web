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
  Star,
  Users,
} from "lucide-react";
import {
  AUDIENCES,
  CASEL_SKILLS,
  MISSION_PILLARS,
  PRINCIPLES,
  STEPS,
  TESTIMONIALS,
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
          eyebrow="Sứ mệnh nuôi dưỡng"
          title="Trang bị cho con hành trang cảm xúc vững chắc trước ngưỡng cửa tương lai"
          desc="Trẻ em hôm nay đối mặt với nhiều xáo trộn tâm lý nhưng thường thiếu không gian an toàn để học cách gọi tên và xử lý. StoryWeaver ra đời để biến mỗi giờ đọc sách thành một bài học trưởng thành nhẹ nhàng."
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
          eyebrow="Tiêu chuẩn quốc tế"
          eyebrowTone="secondary"
          title="5 Năng lực Cảm xúc Cốt lõi theo Chuẩn CASEL Hoa Kỳ"
          desc="Được thiết kế dựa trên khung học tập xã hội - cảm xúc hàng đầu thế giới, chuyển thể thành các tình huống gần gũi trong đời sống hàng ngày của trẻ."
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
                <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-navy/60">
                  <BookOpen size={16} className={t.text} /> {s.stories}+ Truyện thực hành
                </p>
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
          eyebrow="Trải nghiệm trực quan"
          title="3 Bước Đơn Giản để Tạo Giờ Đọc Kỳ Diệu Cho Bé"
          desc="Không cần kỹ năng công nghệ phức tạp, cha mẹ chỉ mất chưa đầy 3 phút để chuẩn bị một câu chuyện ý nghĩa trước giờ đi ngủ."
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
          eyebrow="Hệ sinh thái toàn diện"
          eyebrowTone="secondary"
          title="Đồng Hành Cùng Những Người Yêu Thương Trẻ Thơ"
          desc="StoryWeaver kết nối gia đình, nhà giáo dục và những người sáng tác truyện trong một môi trường văn minh, an toàn và bổ ích."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
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

export function TestimonialsSection() {
  return (
    <section id="cong-dong" className="mx-auto w-full max-w-[1440px] scroll-mt-20 px-4 py-16 md:px-8">
      <div className="flex flex-col gap-10">
        <SectionHeader
          eyebrow="Tiếng nói người thật việc thật"
          title="Được Yêu Thích Bởi Các Gia Đình & Thầy Cô"
          desc="Cảm xúc tích cực và sự chuyển biến thật của các bé là nguồn động lực lớn nhất để chúng tôi hoàn thiện mỗi ngày."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="flex flex-col justify-between gap-5 rounded-[2rem] bg-white p-6 shadow-mid">
              <div className="flex flex-col gap-3">
                <div className="flex gap-0.5" aria-label="5 sao">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={20} className="fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-navy/85 italic">“{t.quote}”</blockquote>
              </div>
              <figcaption className="flex items-center gap-3 pt-1">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-surface text-2xl" aria-hidden="true">
                  {t.avatar}
                </span>
                <span>
                  <span className="block font-display font-bold">{t.name}</span>
                  <span className="text-sm text-navy/60">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
