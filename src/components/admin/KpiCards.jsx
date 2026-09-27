import { ArrowUp, BadgeCheck, Cpu, DollarSign, IdCard, Percent, PieChart, ShoppingBag, TrendingUp, Users, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { formatMillions, formatNumber, formatVND } from "../../utils/format";

function KpiCard({ label, icon: Icon, iconClass, value, valueClass = "", trend, trendIcon: TrendIcon = TrendingUp, trendClass = "text-secondary-dark", footLabel, footValue, highlight }) {
  return (
    <div className={`flex flex-col justify-between rounded-card p-4 shadow-low transition hover:shadow-mid ${highlight ? "bg-primary-tint" : "bg-white"}`}>
      <div className="flex items-center justify-between gap-2 pb-1">
        <span className={`truncate text-xs font-bold ${highlight ? "text-primary-dark" : "text-navy/60"}`}>{label}</span>
        {Icon && (
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${iconClass}`}>
            <Icon size={17} />
          </span>
        )}
      </div>
      <div>
        <p className={`font-display text-2xl font-bold tracking-tight ${valueClass}`}>{value}</p>
        <p className={`mt-1 flex items-center gap-1 text-xs font-bold ${trendClass}`}>
          <TrendIcon size={14} /> {trend}
        </p>
      </div>
      <div className={`mt-2 flex items-center justify-between gap-2 border-t pt-2 text-xs ${highlight ? "border-primary/20 text-primary-dark" : "border-outline text-navy/55"}`}>
        <span className="truncate">{footLabel}</span>
        <span className={`shrink-0 font-semibold ${highlight ? "" : "text-navy"}`}>{footValue}</span>
      </div>
    </div>
  );
}

function KpiCards({ kpis }) {
  const { parents, sellers, subscriptions, gmv, commission, aiCost, pendingWithdrawals } = kpis;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
      <KpiCard label="Tổng Phụ huynh" icon={Users} iconClass="bg-secondary-tint text-secondary-dark" value={formatNumber(parents.total)}
        trend={`+${parents.growth}% tuần này`} footLabel="Tài khoản hoạt động" footValue={`${parents.activeRate}%`} />
      <KpiCard label="Tác giả hoạt động" icon={IdCard} iconClass="bg-primary-tint text-primary-dark" value={formatNumber(sellers.active)}
        trend={`${sellers.revenueShare} chia sẻ DT`} trendIcon={PieChart} trendClass="text-primary-dark"
        footLabel="Mới trong kỳ" footValue={`+${sellers.newThisPeriod} tác giả`} />
      <KpiCard label="Thuê bao Gia Đình" icon={BadgeCheck} iconClass="bg-navy-tint text-navy-soft" value={formatNumber(subscriptions.total)}
        trend={`+${subscriptions.growth.toFixed(1)}% MoM`} footLabel="Tỷ lệ gia hạn" footValue={`${subscriptions.renewRate}%`} />
      <KpiCard label="GMV Chợ truyện" icon={ShoppingBag} iconClass="bg-secondary-tint text-secondary-dark" value={formatMillions(gmv.amount, 1)}
        trend={`+${gmv.growth}% so với kỳ trước`} trendIcon={ArrowUp} footLabel="Tổng giao dịch" footValue={`${formatNumber(gmv.transactions)} lượt`} />
      <KpiCard label="Hoa hồng nền tảng" icon={DollarSign} iconClass="bg-primary-tint text-primary-dark" value={formatMillions(commission.amount)} valueClass="text-primary-dark"
        trend={`Phí sàn ${commission.rate}% Net`} trendIcon={Percent} trendClass="text-primary-dark"
        footLabel="Ký quỹ (Escrow)" footValue={formatMillions(commission.escrow, 1)} />
      <KpiCard label="Chi phí hạ tầng AI" icon={Cpu} iconClass="bg-outline text-navy/70" value={formatMillions(aiCost.amount)}
        trend={`Biên gộp: ${aiCost.grossMargin}%`} trendIcon={BadgeCheck} footLabel="Tỷ trọng DT" footValue={`${aiCost.revenueShare}%`} />
      <Link to={ROUTES.ADMIN.WITHDRAWALS} className="rounded-card focus-visible:ring-2 focus-visible:ring-primary">
        <KpiCard highlight label="Chờ duyệt rút tiền" value={`${pendingWithdrawals.count} lệnh`} valueClass="text-primary-dark"
          trend={formatVND(pendingWithdrawals.amount)} trendIcon={Wallet} trendClass="text-primary-dark"
          footLabel="Cần giải ngân" footValue={<span className="font-bold underline">Xử lý ngay</span>} />
      </Link>
    </div>
  );
}

export default KpiCards;
