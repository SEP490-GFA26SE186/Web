import { ArrowRight, Info, Sprout } from "lucide-react";
import { CASEL } from "../../constants/casel";
import { EQ_LEVELS, EQ_REPORT_NOTE, levelLabel } from "../../constants/eqLevels";
import { ROUTES } from "../../constants/routes";
import { Button, Card, CardHeader, EmptyState } from "../ui";

// Khung rộng hơn chiều cao để nhãn 2 dòng ở trục trái / phải không bị cắt
const WIDTH = 560;
const HEIGHT = 360;
const CX = WIDTH / 2;
const CY = HEIGHT / 2 + 10;
const RADIUS = 116;
const RINGS = [1, 2, 3]; // Đang làm quen / Đang phát triển / Vững
const RING_NAMES = ["emerging", "developing", "secure"];

// Điểm trên trục thứ i (bắt đầu từ đỉnh, theo chiều kim đồng hồ); value 0..3
const pointAt = (i, total, value) => {
  const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
  const r = (RADIUS * value) / 3;
  return [CX + Math.cos(angle) * r, CY + Math.sin(angle) * r];
};

const toPath = (points) => points.map((p) => p.join(",")).join(" ");

/** Nhãn mức độ (luôn có chữ, không chỉ màu). */
export function LevelBadge({ level, className = "" }) {
  const meta = EQ_LEVELS[level];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${
        meta ? meta.badge : "border border-dashed border-navy/25 text-navy/55"
      } ${className}`}
    >
      {levelLabel(level)}
    </span>
  );
}

/**
 * Radar 5 năng lực theo MỨC (1–3), không theo %. Năng lực chưa có dữ liệu: trục để trống, ghi "chưa có dữ liệu".
 * Chỉ nối hai trục kề nhau khi cả hai có mức; đủ 5 trục mới tô vùng.
 * competencies: [{ caselCode, nameVi, level }]
 */
export function RadarChart({ competencies }) {
  const n = competencies.length;
  const value = (c) => EQ_LEVELS[c.level]?.value ?? null;
  const points = competencies.map((c, i) => (value(c) == null ? null : pointAt(i, n, value(c))));
  const complete = points.every(Boolean);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="mx-auto w-full max-w-140" role="img" aria-label="Biểu đồ mức độ 5 năng lực CASEL">
      <title>
        {competencies.map((c) => `${CASEL[c.caselCode]?.label ?? c.nameVi}: ${levelLabel(c.level)}`).join("; ")}
      </title>
      {RINGS.map((lv) => (
        <polygon key={lv} points={toPath(competencies.map((_, i) => pointAt(i, n, lv)))} fill="none" stroke="rgba(30, 41, 59, 0.08)" strokeWidth="1.5" />
      ))}
      {competencies.map((c, i) => {
        const [x, y] = pointAt(i, n, 3);
        return (
          <line
            key={c.caselCode}
            x1={CX}
            y1={CY}
            x2={x}
            y2={y}
            stroke={value(c) == null ? "#e5d9c9" : "#f1e8dc"}
            strokeWidth="1.5"
            strokeDasharray={value(c) == null ? "4 4" : undefined}
          />
        );
      })}
      {/* Nhãn vòng dọc trục trên cùng */}
      {RINGS.map((lv, k) => {
        const [x, y] = pointAt(0, n, lv);
        return (
          <text key={lv} x={x + 6} y={y + 4} className="fill-navy/45 text-[10px] font-semibold">
            {EQ_LEVELS[RING_NAMES[k]].label}
          </text>
        );
      })}

      {complete && <polygon points={toPath(points)} fill="#00a896" fillOpacity="0.16" stroke="none" />}
      {points.map((p, i) => {
        const q = points[(i + 1) % n];
        if (!p || !q) return null;
        return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} stroke="#006b5f" strokeWidth="2" strokeLinecap="round" />;
      })}
      {points.map((p, i) =>
        p ? <circle key={competencies[i].caselCode} cx={p[0]} cy={p[1]} r="5.5" fill="#006b5f" stroke="#fff" strokeWidth="2" /> : null,
      )}

      {competencies.map((c, i) => {
        const [x, y] = pointAt(i, n, 3.75);
        const anchor = Math.abs(x - CX) < 5 ? "middle" : x > CX ? "start" : "end";
        const tx = anchor === "start" ? x - 18 : anchor === "end" ? x + 18 : x;
        const ty = y - 4;
        const empty = value(c) == null;
        return (
          <text key={c.caselCode} x={tx} y={ty} textAnchor={anchor}>
            <tspan x={tx} className={`text-[13px] font-bold ${empty ? "fill-navy/45" : "fill-navy"}`}>
              {CASEL[c.caselCode]?.short ?? c.nameVi}
            </tspan>
            <tspan x={tx} dy="16" className={`text-[11px] font-semibold ${empty ? "fill-navy/40" : "fill-secondary-dark"}`}>
              {empty ? "chưa có dữ liệu" : levelLabel(c.level)}
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}

/** Thẻ báo cáo EQ ở dashboard: radar mức độ + mức từng năng lực (eqReport của /children/:id/overview). */
function EqRadarCard({ childName, report }) {
  const competencies = report?.competencies ?? [];
  const hasAnyLevel = competencies.some((c) => c.level);

  return (
    <Card reveal index={4} className="flex h-full flex-col md:p-7">
      <CardHeader
        title={`Báo cáo EQ của ${childName}`}
        description="Mức hiểu ở 5 năng lực CASEL, từ câu trả lời lần đọc đầu của các truyện AI"
        action={
          <Button variant="ghost" size="sm" to={ROUTES.PARENT.EQ_JOURNEY} iconRight={ArrowRight} className="text-primary-dark hover:text-primary-dark">
            Chi tiết
          </Button>
        }
      />

      {hasAnyLevel ? (
        <div className="my-4">
          <RadarChart competencies={competencies} />
        </div>
      ) : (
        <EmptyState
          icon={Sprout}
          tone="secondary"
          title="Chưa có dữ liệu để vẽ biểu đồ"
          description={`Mỗi kỹ năng cần ít nhất ${report?.settings?.minItems ?? 3} câu trả lời. Biểu đồ sẽ hiện khi bé đọc thêm truyện có câu hỏi.`}
          className="my-5 rounded-2xl bg-surface/70"
        />
      )}

      <ul className="grid gap-1.5 text-sm sm:grid-cols-2">
        {competencies.map((c) => (
          <li key={c.caselCode} className="flex items-center justify-between gap-2 rounded-xl border border-navy/[0.05] bg-surface/50 px-3 py-2 transition-colors hover:bg-surface">
            <span className="font-semibold">{c.nameVi}</span>
            <LevelBadge level={c.level} />
          </li>
        ))}
      </ul>

      <p className="mt-4 flex items-start gap-2 text-xs text-navy/55">
        <Info size={14} className="mt-0.5 shrink-0" />
        {EQ_REPORT_NOTE}
      </p>
    </Card>
  );
}

export default EqRadarCard;
