import { useState } from "react";
import { LineChart, Table2 } from "lucide-react";
import { formatVND } from "../../utils/format";

// Doanh thu theo ngày (cột chồng: gói + truyện) và chi phí AI (đường nét đứt). Một trục Y (VND).
const COLORS = { plan: "#994700", listing: "#e08a2c", cost: "#008a7a", grid: "#f1e8dc" };
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
  const max = niceMax(Math.max(...series.map((d) => Math.max(d.plan + d.listing, d.aiCost ?? 0))));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const band = innerW / n;
  const barW = Math.max(2, Math.min(28, band * 0.6));
  const cx = (i) => PAD.left + band * i + band / 2;
  const y = (v) => PAD.top + innerH - (innerH * v) / max;
  const every = Math.ceil(n / 10); // tối đa ~10 nhãn trục X

  return (
    <div className="space-y-2 rounded-card bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm" style={{ background: COLORS.plan }} /> Gói</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm" style={{ background: COLORS.listing }} /> Truyện (giá bán)</span>
          <span className="flex items-center gap-1.5 text-navy/70"><span className="w-5 border-t-2 border-dashed" style={{ borderColor: COLORS.cost }} /> Chi phí AI</span>
        </div>
        <div className="flex rounded-full bg-white p-0.5 shadow-low" role="tablist" aria-label="Kiểu hiển thị">
          {[{ v: "chart", icon: LineChart, label: "Biểu đồ" }, { v: "table", icon: Table2, label: "Bảng số liệu" }].map(({ v, icon: Icon, label }) => (
            <button key={v} type="button" role="tab" aria-selected={view === v} aria-label={label} title={label} onClick={() => setView(v)} className={`rounded-full p-1 ${view === v ? "bg-primary-tint text-primary-dark" : "text-navy/50"}`}>
              <Icon size={15} />
            </button>
          ))}
        </div>
      </div>

      {view === "table" ? (
        <div className="max-h-72 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-navy/60">
              <tr><th className="py-1">Ngày</th><th className="text-right">Gói</th><th className="text-right">Truyện</th><th className="text-right">Hoa hồng</th><th className="text-right">Chi phí AI</th></tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {series.map((d) => (
                <tr key={d.day}>
                  <td className="py-1.5">{dayLabel(d.day)}</td>
                  <td className="text-right">{formatVND(d.plan)}</td>
                  <td className="text-right">{formatVND(d.listing)}</td>
                  <td className="text-right">{formatVND(d.commission)}</td>
                  <td className="text-right">{formatVND(d.aiCost ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Doanh thu và chi phí AI theo ngày" onMouseLeave={() => setHover(null)}>
            {[0, 0.25, 0.5, 0.75, 1].map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={W - PAD.right} y1={y(max * t)} y2={y(max * t)} stroke={COLORS.grid} />
                <text x={PAD.left - 6} y={y(max * t) + 4} textAnchor="end" className="fill-navy/50 text-[10px]">{short(max * t)}</text>
              </g>
            ))}
            {series.map((d, i) => (
              <g key={d.day} onMouseEnter={() => setHover(i)}>
                <rect x={PAD.left + band * i} y={PAD.top} width={band} height={innerH} fill="transparent" />
                <rect x={cx(i) - barW / 2} y={y(d.plan)} width={barW} height={y(0) - y(d.plan)} fill={COLORS.plan} rx="2" />
                <rect x={cx(i) - barW / 2} y={y(d.plan + d.listing)} width={barW} height={y(d.plan) - y(d.plan + d.listing)} fill={COLORS.listing} rx="2" />
                {i % every === 0 && <text x={cx(i)} y={H - 8} textAnchor="middle" className="fill-navy/50 text-[10px]">{dayLabel(d.day)}</text>}
              </g>
            ))}
            <path
              d={series.map((d, i) => `${i ? "L" : "M"} ${cx(i)} ${y(d.aiCost ?? 0)}`).join(" ")}
              fill="none"
              stroke={COLORS.cost}
              strokeWidth="2"
              strokeDasharray="6 4"
              pointerEvents="none"
            />
          </svg>
          {hover != null && (
            <div className="pointer-events-none absolute top-2 rounded-card bg-white p-2.5 text-xs shadow-mid" style={{ left: `${(cx(hover) / W) * 100}%`, transform: `translateX(${hover > n / 2 ? "-105%" : "5%"})` }}>
              <p className="mb-1 font-bold">{dayLabel(series[hover].day)}</p>
              <p>Gói: <b>{formatVND(series[hover].plan)}</b></p>
              <p>Truyện: <b>{formatVND(series[hover].listing)}</b></p>
              <p>Chi phí AI: <b>{formatVND(series[hover].aiCost ?? 0)}</b></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FinanceChart;
