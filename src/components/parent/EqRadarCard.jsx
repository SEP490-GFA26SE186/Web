import { ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { CASEL } from "../../constants/casel";
import { ROUTES } from "../../constants/routes";
import { EQ_MIN_ITEMS } from "../../services/childService";

// Khung rộng hơn chiều cao để nhãn dài (VD "Kỹ năng QH (92%)") không bị cắt
const WIDTH = 560;
const HEIGHT = 340;
const CX = WIDTH / 2;
const CY = HEIGHT / 2 + 6;
const RADIUS = 110;
const LEVELS = [0.25, 0.5, 0.75, 1];

// Điểm trên trục thứ i (bắt đầu từ đỉnh, theo chiều kim đồng hồ)
const pointAt = (i, total, ratio) => {
  const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
  return [CX + Math.cos(angle) * RADIUS * ratio, CY + Math.sin(angle) * RADIUS * ratio];
};

const toPath = (points) => points.map((p) => p.join(",")).join(" ");

// skills: [{ caselCode, score: 0–100 | null }] — null = chưa đủ dữ liệu, vẽ ở tâm
function RadarChart({ skills }) {
  const n = skills.length;
  const ratio = (s) => (s.score ?? 0) / 100;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mx-auto w-full max-w-135" role="img" aria-label="Biểu đồ EQ theo 5 năng lực CASEL">
      {LEVELS.map((lv) => (
        <polygon key={lv} points={toPath(skills.map((_, i) => pointAt(i, n, lv)))} fill="none" stroke="#f1e8dc" strokeWidth="1.5" />
      ))}
      {skills.map((_, i) => {
        const [x, y] = pointAt(i, n, 1);
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="#f1e8dc" strokeWidth="1.5" />;
      })}

      <polygon
        points={toPath(skills.map((s, i) => pointAt(i, n, ratio(s))))}
        fill="#00a896"
        fillOpacity="0.18"
        stroke="#006b5f"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {skills.map((s, i) => {
        if (s.score == null) return null;
        const [x, y] = pointAt(i, n, ratio(s));
        return <circle key={s.caselCode} cx={x} cy={y} r="5" fill="#006b5f" stroke="#fff" strokeWidth="2" />;
      })}

      {skills.map((s, i) => {
        const [x, y] = pointAt(i, n, 1.28);
        const anchor = Math.abs(x - CX) < 5 ? "middle" : x > CX ? "start" : "end";
        return (
          <text
            key={s.caselCode}
            x={anchor === "start" ? x - 14 : anchor === "end" ? x + 14 : x}
            y={anchor === "middle" && y < CY ? y + 8 : y + 4}
            textAnchor={anchor}
            className={`text-[13px] font-bold ${s.score == null ? "fill-navy/40" : "fill-navy"}`}
          >
            {CASEL[s.caselCode]?.short} ({s.score == null ? "chưa đủ" : `${s.score}%`})
          </text>
        );
      })}
    </svg>
  );
}

/**
 * Báo cáo EQ theo 5 năng lực CASEL (eq_competency_stats).
 * Chỉ tính lần chọn đầu của lần chơi đầu, trên toàn bộ lịch sử; < 5 câu trả lời → "chưa đủ dữ liệu".
 */
function EqRadarCard({ childName, skills }) {
  const answered = skills.reduce((sum, s) => sum + s.items, 0);
  const hasAnyScore = skills.some((s) => s.score != null);

  return (
    <section className="card flex flex-col p-6 md:p-7">
      <div>
        <h3 className="text-xl">Báo cáo EQ của {childName}</h3>
        <p className="mt-1 text-sm text-navy/60">Dựa trên {answered} câu trả lời ở các điểm dừng trong truyện (lần đọc đầu)</p>
      </div>

      {hasAnyScore ? (
        <div className="my-4">
          <RadarChart skills={skills} />
        </div>
      ) : (
        <div className="my-6 rounded-2xl bg-surface p-6 text-center">
          <p className="text-4xl">🌱</p>
          <p className="mt-2 font-display font-bold">Chưa đủ dữ liệu để vẽ biểu đồ</p>
          <p className="mt-1 text-sm text-navy/60">
            Mỗi năng lực cần ít nhất {EQ_MIN_ITEMS} câu trả lời. Biểu đồ sẽ hiện khi bé đọc thêm truyện có điểm dừng.
          </p>
        </div>
      )}

      <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
        {skills.map((s) => (
          <li key={s.caselCode} className="flex items-center justify-between gap-2 rounded-xl bg-surface px-3 py-2">
            <span className="font-semibold">{s.nameVi}</span>
            <span className={s.score == null ? "text-xs text-navy/50" : "font-bold text-secondary-dark"}>
              {s.score == null ? `${s.items}/${EQ_MIN_ITEMS} câu` : `${s.score}%`}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 flex items-start gap-2 text-xs text-navy/60">
        <Info size={14} className="mt-0.5 shrink-0" />
        Đây là tín hiệu quan sát qua lựa chọn của bé trong truyện, không mang tính chẩn đoán tâm lý hay y khoa.
      </p>

      <Link
        to={ROUTES.PARENT.EQ_JOURNEY}
        className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-bold text-primary-dark hover:gap-2.5 hover:text-primary"
      >
        Xem tiến bộ theo thời gian <ArrowRight size={16} />
      </Link>
    </section>
  );
}

export default EqRadarCard;
