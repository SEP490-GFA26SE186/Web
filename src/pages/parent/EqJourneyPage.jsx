import { useState } from "react";
import { Lightbulb, Loader2, Sparkles, TrendingUp } from "lucide-react";
import { RadarChart } from "../../components/parent/EqRadarCard";
import NoChildState from "../../components/parent/NoChildState";
import { CASEL } from "../../constants/casel";
import { EQ_ADVICE } from "../../constants/eqAdvice";
import { CHECKPOINT_TYPES } from "../../constants/story";
import { useChildEqJourney, useSelectedChild } from "../../hooks/useChildProfile";

// Màu 5 năng lực trên biểu đồ xu hướng (đủ tách biệt, giữ tương phản trên nền sáng)
const SKILL_COLORS = {
  self_awareness: "#994700",
  self_management: "#008a7a",
  social_awareness: "#5b4bc4",
  relationship_skills: "#c2185b",
  responsible_decision_making: "#2f6db3",
};
const W = 640;
const H = 220;
const PAD = { top: 12, right: 28, bottom: 26, left: 34 };
const weekLabel = (d) => `${d.slice(8, 10)}/${d.slice(5, 7)}`;

/** Xu hướng điểm theo tuần, mỗi năng lực một đường; tuần không có câu trả lời thì đứt đoạn. */
function TrendChart({ trend }) {
  const n = trend.length;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (n === 1 ? innerW / 2 : (innerW * i) / (n - 1));
  const y = (v) => PAD.top + innerH - (innerH * v) / 100;
  const codes = Object.keys(CASEL);
  const segments = (code) => {
    const parts = [];
    let cur = [];
    trend.forEach((w, i) => {
      const s = w.skills[code];
      if (s) cur.push([x(i), y(s.score), s]);
      else if (cur.length) {
        parts.push(cur);
        cur = [];
      }
    });
    if (cur.length) parts.push(cur);
    return parts;
  };
  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Xu hướng điểm EQ theo tuần">
        {[0, 50, 100].map((v) => (
          <g key={v}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="#f1e8dc" />
            <text x={PAD.left - 6} y={y(v) + 4} textAnchor="end" className="fill-navy/50 text-[10px]">{v}</text>
          </g>
        ))}
        {trend.map((w, i) => (
          <text key={w.weekStart} x={x(i)} y={H - 8} textAnchor="middle" className="fill-navy/50 text-[10px]">{weekLabel(w.weekStart)}</text>
        ))}
        {codes.map((code) =>
          segments(code).map((pts, k) => (
            <g key={`${code}-${k}`}>
              {pts.length > 1 && <path d={pts.map(([px, py], j) => `${j ? "L" : "M"} ${px} ${py}`).join(" ")} fill="none" stroke={SKILL_COLORS[code]} strokeWidth="2.5" strokeLinejoin="round" />}
              {pts.map(([px, py, s]) => (
                <circle key={px} cx={px} cy={py} r="4" fill={SKILL_COLORS[code]} stroke="#fff" strokeWidth="1.5">
                  <title>{`${CASEL[code].label}: ${s.score} điểm (${s.items} câu)`}</title>
                </circle>
              ))}
            </g>
          )),
        )}
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
        {codes.map((code) => (
          <span key={code} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: SKILL_COLORS[code] }} /> {CASEL[code].short}
          </span>
        ))}
      </div>
    </div>
  );
}

function AdviceCard({ code, tone, title }) {
  const a = EQ_ADVICE[code];
  if (!a) return null;
  return (
    <div className={`space-y-2 rounded-card p-5 ${tone}`}>
      <p className="text-xs font-bold tracking-wide uppercase opacity-70">{title}</p>
      <p className="font-display text-lg font-bold">{CASEL[code].label}</p>
      <p className="text-sm">{a.advice}</p>
      <ul className="list-disc space-y-0.5 pl-5 text-sm opacity-90">
        {a.activities.map((x) => <li key={x}>{x}</li>)}
      </ul>
    </div>
  );
}

// Báo cáo EQ (luồng 5.6): điểm 5 năng lực cộng dồn, xu hướng theo tuần, theo loại câu hỏi, câu trả lời gần đây.
// Chỉ tính lượt đọc ĐẦU của mỗi truyện — đọc lại để vui, không đổi điểm.
function EqJourneyPage() {
  const { child, isEmpty } = useSelectedChild();
  const [weeks, setWeeks] = useState(8);
  const { data: r, isLoading, error, isFetching } = useChildEqJourney(child?.id, weeks);

  if (isEmpty) return <NoChildState />;
  if (isLoading || !child) return <Loader2 size={32} className="animate-spin text-primary" />;
  if (error) return <p className="card p-6 text-danger">{error.message}</p>;

  const enough = r.skills.filter((s) => s.score != null).length;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
            <TrendingUp size={16} /> Báo cáo EQ
          </p>
          <h1 className="text-3xl">Hành trình cảm xúc của {r.childName}</h1>
          <p className="mt-1 max-w-2xl text-navy/70">
            Điểm tính từ câu trả lời ở lượt đọc đầu tiên của mỗi truyện ({r.totals.answers} câu, {r.totals.completed} lượt đọc hết truyện). Mỗi năng lực cần ít nhất {r.minItems} câu mới có điểm.
          </p>
        </div>
        {isFetching && <Loader2 size={18} className="animate-spin text-primary" />}
      </div>

      {r.totals.answers === 0 ? (
        <div className="card flex flex-col items-center gap-2 p-10 text-center">
          <Sparkles size={36} className="text-primary" />
          <p className="font-display text-lg font-bold">Chưa có dữ liệu</p>
          <p className="max-w-md text-navy/60">Khi {r.childName} đọc truyện và trả lời các câu hỏi trong Chế độ Trẻ Em, báo cáo sẽ hiện ở đây.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-5">
            <section className="card p-5 xl:col-span-3">
              <h2 className="mb-2 text-lg">5 năng lực CASEL</h2>
              <RadarChart skills={r.skills} />
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {r.skills.map((s) => (
                  <li key={s.caselCode} className="flex items-center justify-between rounded-2xl bg-surface px-4 py-2 text-sm">
                    <span className="font-semibold">{CASEL[s.caselCode].label}</span>
                    <span className="font-bold">{s.score != null ? `${s.score}` : <span className="text-xs font-normal text-navy/50">{s.items}/{r.minItems} câu</span>}</span>
                  </li>
                ))}
              </ul>
            </section>
            <div className="space-y-4 xl:col-span-2">
              {r.strongest && <AdviceCard code={r.strongest} tone="bg-secondary-tint text-secondary-dark" title="Điểm mạnh — tiếp tục khen ngợi" />}
              {r.focus && <AdviceCard code={r.focus} tone="bg-primary-tint text-primary-dark" title="Cần đồng hành thêm" />}
              {!r.strongest && (
                <div className="card flex gap-3 p-5 text-sm text-navy/70">
                  <Lightbulb size={20} className="shrink-0 text-primary" />
                  Cần thêm câu trả lời ({enough}/5 năng lực đã đủ dữ liệu) để biết điểm mạnh và năng lực cần đồng hành.
                </div>
              )}
            </div>
          </div>

          <section className="card space-y-3 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg">Xu hướng theo tuần</h2>
              <div className="flex gap-2" role="tablist" aria-label="Khoảng thời gian">
                {[4, 8, 12].map((n) => (
                  <button key={n} type="button" role="tab" aria-selected={weeks === n} onClick={() => setWeeks(n)} className={`rounded-full px-3 py-1 text-sm font-bold ${weeks === n ? "bg-primary text-white" : "bg-surface text-navy/70"}`}>
                    {n} tuần
                  </button>
                ))}
              </div>
            </div>
            <TrendChart trend={r.trend} />
            <p className="text-xs text-navy/50">Điểm trung bình các câu trả lời trong tuần (0–100). Tuần ít câu thì điểm dao động nhiều — xem cùng điểm cộng dồn ở trên.</p>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="card p-5">
              <h2 className="mb-3 text-lg">Theo loại câu hỏi</h2>
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-navy/60">
                  <tr><th className="py-1">Loại</th><th className="text-right">Số câu</th><th className="text-right">Điểm TB</th><th className="text-right">Đúng ngay lần đầu</th></tr>
                </thead>
                <tbody className="divide-y divide-outline">
                  {r.byType.map((t) => (
                    <tr key={t.type}>
                      <td className="py-2">{CHECKPOINT_TYPES[t.type]?.short ?? t.type}</td>
                      <td className="text-right">{t.answered}{t.skipped ? <span className="text-navy/50"> ({t.skipped} bỏ qua)</span> : null}</td>
                      <td className="text-right font-bold">{t.avgScore ?? "—"}</td>
                      <td className="text-right">{t.firstTryRate != null ? `${t.firstTryRate}%` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <section className="card p-5">
              <h2 className="mb-3 text-lg">Câu trả lời gần đây</h2>
              <ul className="divide-y divide-outline text-sm">
                {r.recent.map((a, i) => (
                  <li key={i} className="space-y-0.5 py-2">
                    <p className="font-semibold">{a.question}</p>
                    <p className="text-xs text-navy/60">
                      {a.storyTitle} • {CHECKPOINT_TYPES[a.type]?.short ?? a.type} •{" "}
                      {a.skipped ? "bỏ qua" : a.score == null ? "không chấm điểm" : a.attempts === 1 ? `đúng ngay (${a.score})` : `cần gợi ý (${a.score})`} • {new Date(a.answeredAt).toLocaleDateString("vi-VN")}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default EqJourneyPage;
