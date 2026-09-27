import { useState } from "react";
import { Table2, LineChart } from "lucide-react";
import { formatVND } from "../../utils/format";

// Màu đã chạy qua bộ kiểm tra màu (dataviz validator): đạt tách biệt cho người mù màu & độ tương phản
const COLORS = { revenue: "#994700", cost: "#008a7a", grid: "#f1e8dc" };
const W = 600;
const H = 240;
const PAD = { top: 16, right: 16, bottom: 28, left: 44 };

const niceMax = (v) => {
  const step = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / step) * step;
};

// Một trục Y duy nhất (triệu VND) cho cả 2 chuỗi — không dùng trục kép
function RevenueChart({ series }) {
  const [hover, setHover] = useState(null);
  const [view, setView] = useState("chart");
  const { labels, revenue, aiCost, netMargin } = series;

  const max = niceMax(Math.max(...revenue));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (innerW * i) / (labels.length - 1);
  const y = (v) => PAD.top + innerH - (innerH * v) / max;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(max * t));

  const linePath = (data) => data.map((v, i) => `${i ? "L" : "M"} ${x(i)} ${y(v)}`).join(" ");
  const areaPath = (data) => `${linePath(data)} L ${x(data.length - 1)} ${y(0)} L ${x(0)} ${y(0)} Z`;
  const last = labels.length - 1;
  const bandW = innerW / (labels.length - 1);

  return (
    <div className="flex flex-col gap-2 rounded-card bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="h-0.5 w-5 rounded-full" style={{ background: COLORS.revenue }} /> Doanh thu gộp
          </span>
          <span className="flex items-center gap-1.5 font-semibold text-navy/70">
            <span className="w-5 border-t-2 border-dashed" style={{ borderColor: COLORS.cost }} /> Chi phí AI
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-secondary-dark">Biên lợi nhuận ròng: +{netMargin}%</span>
          <div className="flex rounded-full bg-white p-0.5 shadow-low" role="tablist" aria-label="Kiểu hiển thị">
            {[
              { v: "chart", icon: LineChart, label: "Biểu đồ" },
              { v: "table", icon: Table2, label: "Bảng số liệu" },
            ].map(({ v, icon: Icon, label }) => (
              <button
                key={v}
                role="tab"
                aria-selected={view === v}
                aria-label={label}
                title={label}
                onClick={() => setView(v)}
                className={`rounded-full p-1 ${view === v ? "bg-primary-tint text-primary-dark" : "text-navy/50"}`}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "table" ? (
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-navy/60">
            <tr>
              <th className="py-2 font-semibold">Tuần</th>
              <th className="py-2 text-right font-semibold">Doanh thu gộp</th>
              <th className="py-2 text-right font-semibold">Chi phí AI</th>
            </tr>
          </thead>
          <tbody>
            {labels.map((l, i) => (
              <tr key={l} className="border-t border-outline">
                <td className="py-2">{l}</td>
                <td className="py-2 text-right font-semibold">{formatVND(revenue[i] * 1_000_000)}</td>
                <td className="py-2 text-right">{formatVND(aiCost[i] * 1_000_000)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-60 w-full overflow-visible" role="img" aria-label="Biểu đồ doanh thu và chi phí AI theo tuần">
            <defs>
              <linearGradient id="rev-grad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ff7a00" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#ff7a00" stopOpacity="0" />
              </linearGradient>
            </defs>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke={COLORS.grid} strokeWidth="1" />
                <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="fill-navy/50 text-[11px]">
                  {t}M
                </text>
              </g>
            ))}
            <path d={areaPath(revenue)} fill="url(#rev-grad)" />
            <path d={linePath(revenue)} fill="none" stroke={COLORS.revenue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d={linePath(aiCost)} fill="none" stroke={COLORS.cost} strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />

            {hover != null && <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={y(0)} stroke="#1e293b" strokeOpacity="0.25" strokeWidth="1" />}
            {revenue.map((v, i) => (
              <circle key={`r${i}`} cx={x(i)} cy={y(v)} r={hover === i || i === last ? 5 : 4} fill={COLORS.revenue} stroke="#fff" strokeWidth="2" />
            ))}
            {aiCost.map((v, i) => (
              <circle key={`c${i}`} cx={x(i)} cy={y(v)} r={hover === i ? 5 : 4} fill={COLORS.cost} stroke="#fff" strokeWidth="2" />
            ))}
            {/* Nhãn trực tiếp ở điểm cuối */}
            <text x={x(last) - 8} y={y(revenue[last]) - 10} textAnchor="end" className="fill-navy text-[12px] font-bold">
              {revenue[last]}M
            </text>
            <text x={x(last) - 8} y={y(aiCost[last]) - 10} textAnchor="end" className="fill-navy/70 text-[12px] font-bold">
              {aiCost[last]}M
            </text>

            {labels.map((l, i) => (
              <text
                key={`x${l}`}
                x={x(i)}
                y={H - 6}
                textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"}
                className={`text-[11px] ${hover === i ? "fill-navy font-bold" : "fill-navy/60"}`}
              >
                {l}
              </text>
            ))}

            {/* Vùng bắt chuột rộng hơn điểm */}
            {labels.map((l, i) => (
              <rect
                key={l}
                x={x(i) - bandW / 2}
                y={PAD.top}
                width={bandW}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
          </svg>

          {hover != null && (
            <div
              className="pointer-events-none absolute top-2 z-10 min-w-44 rounded-xl bg-white px-3 py-2 text-xs shadow-high"
              style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > labels.length / 2 ? "-105%" : "5%"})` }}
            >
              <p className="mb-1 font-bold text-navy">{labels[hover]}</p>
              <p className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-navy/70">
                  <span className="h-2 w-2 rounded-full" style={{ background: COLORS.revenue }} /> Doanh thu
                </span>
                <b>{revenue[hover]}M</b>
              </p>
              <p className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-navy/70">
                  <span className="h-2 w-2 rounded-full" style={{ background: COLORS.cost }} /> Chi phí AI
                </span>
                <b>{aiCost[hover]}M</b>
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default RevenueChart;
