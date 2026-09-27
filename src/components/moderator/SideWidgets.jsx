import { Bot, Check, CheckCircle2, ChevronLeft, FileSearch, History, Loader2, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useSampleAudits } from "../../hooks/useModerator";
import { toast } from "../../stores/toastStore";

export function ProgressRing({ value, max, size = 80, stroke = 3.5, children }) {
  const percent = Math.min(100, (value / max) * 100);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
        <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f1e8dc" strokeWidth={stroke} />
        <circle
          cx="18" cy="18" r="15.9155" fill="none" stroke="#00a896" strokeWidth={stroke}
          strokeDasharray={`${percent}, 100`} strokeLinecap="round" className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
}

export function WeeklyAuditCard({ audit }) {
  const sample = useSampleAudits();
  const percent = Math.round((audit.done / audit.target) * 100);
  const remaining = audit.target - audit.done;

  return (
    <section className="flex flex-col gap-4 rounded-stage bg-surface p-6 shadow-low">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-lg">
          <FileSearch size={22} className="text-secondary" /> Kiểm định định kỳ tuần
        </h3>
        <span className="shrink-0 rounded-full bg-secondary-tint px-2 py-0.5 text-xs font-bold text-secondary-dark">{audit.week}</span>
      </div>

      <div className="flex items-center gap-4 rounded-card bg-white p-4 shadow-low">
        <ProgressRing value={audit.done} max={audit.target}>
          <span className="font-display text-lg leading-none font-bold">{audit.done}</span>
          <span className="text-[10px] text-navy/60">/ {audit.target} truyện</span>
        </ProgressRing>
        <div>
          <p className="font-bold">Tiến độ tuần đạt {percent}%</p>
          <p className="text-sm text-navy/65">
            {remaining > 0
              ? `Còn ${remaining} tác phẩm cần lấy mẫu ngẫu nhiên trước ${audit.deadline}.`
              : "Đã hoàn thành chỉ tiêu kiểm định tuần này 🎉"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold tracking-wider text-navy/50 uppercase">Tiêu chí đối chiếu ngẫu nhiên</span>
        {audit.criteria.map((c) => (
          <div key={c.label} className="flex items-center justify-between gap-2 rounded-xl bg-white p-2 text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={18} className="shrink-0 text-secondary" /> {c.label}
            </span>
            <span className="shrink-0 text-xs font-bold text-secondary-dark">{c.pass}% Đạt</span>
          </div>
        ))}
      </div>

      <button
        disabled={remaining === 0 || sample.isPending}
        onClick={() =>
          sample.mutate(Math.min(5, remaining), {
            onSuccess: () => toast.success(`Đã bốc ngẫu nhiên ${Math.min(5, remaining)} truyện vào hàng kiểm định`),
          })
        }
        className="flex w-full items-center justify-center gap-1.5 rounded-full bg-secondary py-2 text-sm font-bold text-white shadow-low transition hover:bg-secondary-dark disabled:opacity-50"
      >
        {sample.isPending ? <Loader2 size={17} className="animate-spin" /> : <Shuffle size={17} />}
        Bốc ngẫu nhiên {Math.min(5, remaining) || 5} truyện kế tiếp
      </button>
    </section>
  );
}

export function AiFlagsCard({ flags }) {
  return (
    <section className="flex flex-col gap-4 rounded-stage bg-surface p-6 shadow-low">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg">
          <Bot size={22} className="text-primary" /> Cảnh báo bất thường AI
        </h3>
        <span className="rounded-full bg-primary-tint px-2 py-0.5 text-xs font-bold text-primary-dark">{flags.length} cảnh báo</span>
      </div>
      <div className="flex flex-col gap-2">
        {flags.map((f) => {
          const parts = f.highlight ? f.detail.split(f.highlight) : [f.detail];
          return (
            <article key={f.id} className="flex flex-col gap-1 rounded-2xl bg-white p-3 shadow-low">
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-bold">{f.subject}</span>
                <span
                  className={`shrink-0 rounded px-1.5 text-[10px] font-bold ${
                    f.level === "anomaly" ? "bg-danger-tint text-danger-dark" : "bg-primary-tint text-primary-dark"
                  }`}
                >
                  {f.level === "anomaly" ? "Bất thường" : "Xem xét"}
                </span>
              </div>
              <p className="text-sm text-navy/65">
                {parts[0]}
                {f.highlight && <strong className="text-danger">{f.highlight}</strong>}
                {parts[1]}
              </p>
              <div className="mt-1 flex items-center justify-between text-[11px] text-navy/60">
                <span>{f.source}</span>
                <Link to={ROUTES.MODERATOR.AI_FLAGS} className="font-bold text-primary-dark hover:underline">
                  {f.action}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      <Link
        to={ROUTES.MODERATOR.AI_FLAGS}
        className="flex w-full items-center justify-center gap-1 rounded-full bg-outline/70 py-2 text-sm font-semibold transition hover:bg-outline"
      >
        <History size={17} /> Xem nhật ký AI Guard toàn diện
      </Link>
    </section>
  );
}

export function GuardianPrinciplesCard() {
  return (
    <section className="flex flex-col gap-3 rounded-stage bg-outline/60 p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-dark text-white shadow-low">
          <ChevronLeft size={20} />
        </span>
        <div>
          <h4 className="font-display text-lg leading-tight font-bold">Quy chuẩn Người Giám Hộ</h4>
          <span className="text-xs font-semibold text-navy/60">Nguyên tắc kim chỉ nam StoryWeaver</span>
        </div>
      </div>
      <div className="flex flex-col gap-1 rounded-card bg-white p-4 shadow-low">
        <p className="flex items-start gap-2 text-sm font-bold text-primary-dark">
          <Check size={18} className="mt-0.5 shrink-0 text-secondary" />
          "AI gợi ý – Con người quyết định – Hệ thống thực thi"
        </p>
        <p className="pl-6 text-sm text-navy/65">
          Thuật toán hỗ trợ rà soát nhanh từ khóa và phân tích biểu cảm, nhưng chỉ có Kiểm duyệt viên con người mới thấu cảm
          được độ an toàn tinh tế đối với tâm lý trẻ nhỏ.
        </p>
      </div>
      <p className="text-center text-[11px] text-navy/60 italic">
        Kiểm duyệt viên chịu trách nhiệm 100% về tính an toàn sư phạm trước khi truyện được phát hành ra cộng đồng phụ huynh.
      </p>
    </section>
  );
}
