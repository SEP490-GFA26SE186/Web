import { ArrowRight, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

// Khung rộng hơn chiều cao để nhãn dài (VD "Kỹ năng quan hệ (92%)") không bị cắt
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

function RadarChart({ skills }) {
  const n = skills.length;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mx-auto w-full max-w-135" role="img" aria-label="Biểu đồ EQ">
      {LEVELS.map((lv) => (
        <polygon
          key={lv}
          points={toPath(skills.map((_, i) => pointAt(i, n, lv)))}
          fill="none"
          stroke="#f1e8dc"
          strokeWidth="1.5"
        />
      ))}
      {skills.map((_, i) => {
        const [x, y] = pointAt(i, n, 1);
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="#f1e8dc" strokeWidth="1.5" />;
      })}

      <polygon
        points={toPath(skills.map((s, i) => pointAt(i, n, s.value / 100)))}
        fill="#00a896"
        fillOpacity="0.18"
        stroke="#006b5f"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {skills.map((s, i) => {
        const [x, y] = pointAt(i, n, s.value / 100);
        return <circle key={s.key} cx={x} cy={y} r="5" fill="#006b5f" stroke="#fff" strokeWidth="2" />;
      })}

      {skills.map((s, i) => {
        const [x, y] = pointAt(i, n, 1.28);
        const anchor = Math.abs(x - CX) < 5 ? "middle" : x > CX ? "start" : "end";
        return (
          <text
            key={s.key}
            x={anchor === "start" ? x - 14 : anchor === "end" ? x + 14 : x}
            y={anchor === "middle" && y < CY ? y + 8 : y + 4}
            textAnchor={anchor}
            className="fill-navy text-[13px] font-bold"
          >
            {s.label} ({s.value}%)
          </text>
        );
      })}
    </svg>
  );
}

function EqRadarCard({ childName, eq }) {
  return (
    <section className="card flex flex-col p-6 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-xl">Hành trình EQ tuần này của {childName}</h3>
          <p className="mt-1 text-sm text-navy/60">
            Quan sát dựa trên {eq.basedOnChoices} lựa chọn trong truyện tương tác
          </p>
        </div>
        <span className="tag-eq">{eq.updatedLabel}</span>
      </div>

      <div className="my-4">
        <RadarChart skills={eq.skills} />
      </div>

      <div className="flex items-start gap-2 rounded-2xl bg-secondary-tint p-5">
        <Lightbulb size={18} className="mt-0.5 shrink-0 text-amber-500" />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-secondary-dark">Nhận xét từ AI Empathy Coach:</p>
            {eq.framework && (
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-navy/60">{eq.framework}</span>
            )}
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-navy/80">
            {eq.coachInsight} {eq.disclaimer && <em className="text-navy/60">{eq.disclaimer}</em>}
          </p>
        </div>
      </div>

      <Link
        to={ROUTES.PARENT.EQ_JOURNEY}
        className="mt-5 inline-flex items-center gap-1.5 self-start text-sm font-bold text-primary-dark hover:gap-2.5 hover:text-primary"
      >
        Xem phân tích chi tiết hành trình EQ <ArrowRight size={16} />
      </Link>
    </section>
  );
}

export default EqRadarCard;
