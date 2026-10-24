import { ArrowUpRight, Minus, TrendingDown, TrendingUp } from "lucide-react";
import Card from "./Card";
import { cn } from "./cn";
import Skeleton from "./Skeleton";

const TONES = {
  primary: "bg-primary-tint text-primary-dark",
  secondary: "bg-secondary-tint text-secondary-dark",
  navy: "bg-navy-tint text-navy-soft",
  danger: "bg-danger-tint text-danger",
};

/**
 * Ô chỉ số dùng chung cho cả 3 cổng.
 * trend: số chênh lệch (+/-) hiển thị kèm mũi tên • trendLabel: chữ sau số, vd. "so với hôm qua"
 * to: cả ô là link (hiện mũi tên góc phải khi hover) • emphasis: tô màu giá trị bằng màu thương hiệu
 */
function StatTile({ icon: Icon, tone = "primary", label, value, hint, trend, trendLabel, to, emphasis = false, loading = false, index = 0, className }) {
  return (
    <Card to={to} padding="none" reveal index={index} className={cn("group p-4 sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-semibold text-navy/60">{label}</p>
        {Icon && (
          <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-transform duration-300 ease-(--ease-out-soft) group-hover:scale-105", TONES[tone])}>
            <Icon size={18} />
          </span>
        )}
      </div>

      {loading ? (
        <Skeleton className="mt-2 h-8 w-24" />
      ) : (
        <p className={cn("mt-1 font-display text-[22px] leading-tight sm:text-[28px] font-bold tracking-tight tabular-nums", emphasis ? "text-primary-dark" : "text-navy")}>
          {value}
        </p>
      )}

      {(trend != null || hint) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          {trend != null && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-bold tabular-nums",
                trend > 0 ? "bg-secondary-tint text-secondary-dark" : trend < 0 ? "bg-danger-tint text-danger-dark" : "bg-navy/[0.06] text-navy/60",
              )}
            >
              {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
              {trend > 0 ? "+" : ""}
              {trend}
            </span>
          )}
          {trendLabel && <span className="text-navy/55">{trendLabel}</span>}
          {hint && <span className="text-navy/55">{hint}</span>}
        </div>
      )}

      {to && (
        <ArrowUpRight
          size={16}
          className="absolute right-4 bottom-4 text-navy/30 opacity-0 transition duration-300 ease-(--ease-out-soft) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary group-hover:opacity-100"
        />
      )}
    </Card>
  );
}

export default StatTile;
