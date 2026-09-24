import { BadgeCheck, Brain, FlaskConical } from "lucide-react";

const HIGHLIGHTS = [
  "Tâm lý học hành vi",
  "Phân nhánh tương tác đa dạng",
  "Báo cáo phụ huynh chi tiết",
  "Chuyển hóa thành hành động đời thật",
];

const STEPS = [
  { title: "Trải nghiệm tình huống", desc: "Bé tự đưa ra quyết định khi gặp khó khăn", tone: "bg-primary-tint text-primary-dark" },
  { title: "Gợi mở & Tự suy ngẫm", desc: "AI tương tác giọng nói giúp bé nhận diện cảm xúc", tone: "bg-secondary-tint text-secondary-dark" },
  { title: "Nhiệm vụ đời thực", desc: "Bố mẹ đồng hành xác nhận thói quen tại nhà", tone: "bg-slate-100 text-navy-soft" },
];

function LearningMethodBanner() {
  return (
    <section className="card flex flex-col items-center justify-between gap-6 p-6 md:p-8 lg:flex-row">
      <div className="flex max-w-xl flex-col gap-3">
        <p className="flex items-center gap-1.5 text-xs font-extrabold tracking-wider text-secondary-dark uppercase">
          <FlaskConical size={16} /> Cơ chế học qua trải nghiệm (Experiential Learning)
        </p>
        <h3 className="text-2xl">Tại sao các kịch bản của StoryWeaver tạo ra chuyển biến thực sự?</h3>
        <p className="text-navy/70">
          Khác với sách đọc thông thường, AI Game Master sẽ biến bé thành nhân vật chính. Bé đứng trước các ngã rẽ đạo
          đức và cảm xúc, tự đưa ra lựa chọn và nhìn thấy hệ quả ngay lập tức trong không gian giả lập an toàn.
        </p>
        <ul className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
          {HIGHLIGHTS.map((h) => (
            <li key={h} className="flex items-center gap-2 text-sm font-semibold">
              <BadgeCheck size={20} className="shrink-0 text-secondary" /> {h}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-full flex-col gap-3 rounded-card bg-surface p-4 lg:w-96">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold">Quy trình 3 bước</span>
          <Brain size={22} className="text-primary" />
        </div>
        {STEPS.map((s, i) => (
          <div key={s.title} className="flex items-start gap-3 rounded-2xl bg-white p-3">
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold ${s.tone}`}>
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-bold">{s.title}</p>
              <p className="text-sm text-navy/65">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LearningMethodBanner;
