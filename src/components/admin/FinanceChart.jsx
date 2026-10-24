import { useState } from "react";
import { LineChart, Table2 } from "lucide-react";
import { formatVND } from "../../utils/format";
import { SegmentedControl, cn } from "../ui";

// Doanh thu theo ngày (cột chồng: gói + truyện). Một trục Y (VND).
const COLORS = { plan: "#994700", listing: "#ff9d42", grid: "rgba(30, 41, 59, 0.07)" };
const VIEWS = [
  { value: "chart", icon: LineChart, label: "Biểu đồ" },
  { value: "table", icon: Table2, label: "Bảng số liệu" },
];
const W = 640;
const H = 240;
const PAD = { top: 16, right: 12, bottom: 28, left: 56 };

const niceMax = (v) => {
  if (v <= 0) return 1000;
  const step = 10 ** Math.floor(Math.log10(v));
  return Math.ceil(v / step) * step;
};
const short = (v) => (v >= 1_000_000 ? `${(v / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}tr` : v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`);
const dayLabel = (day) => `${day.slice(8, 10)}/${day.slice(5, 7)}`;

function FinanceChart({ series }) {
  const [view, setView] = useState("chart");
  const [hover, setHover] = useState(null);
  const n = series.length;
  const max = niceMax(Math.max(...series.map((d) => d.plan + d.listing)));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const band = innerW / n;
  const barW = Math.max(2, Math.min(28, band * 0.6));
  const cx = (i) => PAD.left + band * i + band / 2;
  const y = (v) => PAD.top + innerH - (innerH * v) / max;
  const every = Math.ceil(n / 10); // tối đa ~10 nhãn trục X

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-navy/70">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS.plan }} /> Gói</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS.listing }} /> Truyện (giá bán)</span>
        </div>
        <SegmentedControl value={view} onChange={setView} items={VIEWS} label="Kiểu hiển thị" size="sm" iconOnly />
      </div>

      {view === "table" ? (
        <div className="max-h-72 animate-pop-in overflow-auto rounded-2xl bg-surface/60">
          <table className="w-full text-sm tabular-nums">
            <thead className="sticky top-0 bg-surface text-left text-xs text-navy/55">
              <tr><th className="px-3 py-2 font-semibold">Ngày</th><th className="px-3 text-right font-semibold">Gói</th><th className="px-3 text-right font-semibold">Truyện</th><th className="px-3 text-right font-semibold">Hoa hồng</th></tr>
            </thead>
            <tbody>
              {series.map((d) => (
                <tr key={d.day} className="transition-colors hover:bg-white">
                  <td className="px-3 py-1.5">{dayLabel(d.day)}</td>
                  <td className="px-3 text-right">{formatVND(d.plan)}</td>
                  <td className="px-3 text-right">{formatVND(d.listing)}</td>
                  <td className="px-3 text-right">{formatVND(d.commission)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative animate-pop-in">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Doanh thu theo ngày" onMouseLeave={() => setHover(null)}>
            {[0, 0.25, 0.5, 0.75, 1].map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={W - PAD.right} y1={y(max * t)} y2={y(max * t)} stroke={COLORS.grid} />
                <text x={PAD.left - 6} y={y(max * t) + 4} textAnchor="end" className="fill-navy/50 text-[10px]">{short(max * t)}</text>
              </g>
            ))}
            {series.map((d, i) => (
              <g key={d.day} onMouseEnter={() => setHover(i)} className={cn("transition-opacity duration-200", hover != null && hover !== i && "opacity-45")}>
                <rect x={PAD.left + band * i} y={PAD.top} width={band} height={innerH} rx="4" fill={hover === i ? "rgba(30, 41, 59, 0.035)" : "transparent"} />
                <rect x={cx(i) - barW / 2} y={y(d.plan)} width={barW} height={y(0) - y(d.plan)} fill={COLORS.plan} rx="2" />
                <rect x={cx(i) - barW / 2} y={y(d.plan + d.listing)} width={barW} height={y(d.plan) - y(d.plan + d.listing)} fill={COLORS.listing} rx="2" />
                {i % every === 0 && <text x={cx(i)} y={H - 8} textAnchor="middle" className="fill-navy/50 text-[10px]">{dayLabel(d.day)}</text>}
              </g>
            ))}
          </svg>
          {hover != null && (
            <div className="pointer-events-none absolute top-2 min-w-36 rounded-xl bg-navy px-3 py-2 text-xs text-white tabular-nums shadow-high transition-[left] duration-150" style={{ left: `${(cx(hover) / W) * 100}%`, transform: `translateX(${hover > n / 2 ? "-105%" : "5%"})` }}>
              <p className="mb-1 font-bold text-white/70">{dayLabel(series[hover].day)}</p>
              <p className="flex items-center justify-between gap-3"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: COLORS.plan }} />Gói</span><b>{formatVND(series[hover].plan)}</b></p>
              <p className="flex items-center justify-between gap-3"><span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: COLORS.listing }} />Truyện</span><b>{formatVND(series[hover].listing)}</b></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FinanceChart;
