import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftRight, Download, Gavel, Loader2, Wallet } from "lucide-react";
import FinanceChart from "../../components/admin/FinanceChart";
import { PageHeader, StatCard, Tabs } from "../../components/admin/AdminUi";
import { RANGES, money } from "../../components/admin/adminFormat";
import { ROUTES } from "../../constants/routes";
import { useAdminOverview, useFinanceSummary } from "../../hooks/useAdmin";
import { toast } from "../../stores/toastStore";
import { downloadCsv, formatNumber } from "../../utils/format";

const exportCsv = (d, label) => {
  const r = d.revenue;
  downloadCsv(`storyweaver-tai-chinh-${new Date().toISOString().slice(0, 10)}.csv`, [
    ["Báo cáo tài chính StoryWeaver AI", label],
    [],
    ["Chỉ số", "VND"],
    ["Doanh thu gói", r.planRevenue],
    ["Doanh thu truyện (giá bán)", r.listingGross],
    ["Phần người bán", r.sellerPayable],
    ["Hoa hồng nền tảng", r.commission],
    ["Đã hoàn tiền", r.refunded],
    ["Phần nền tảng giữ", r.platformRevenue],
    [],
    ["Ngày", "Gói", "Truyện", "Hoa hồng"],
    ...d.series.map((s) => [s.day, s.plan, s.listing, s.commission]),
  ]);
  toast.success("Đã xuất CSV (mở được bằng Excel)");
};

// Dashboard điều hành: doanh thu thật từ đơn đã thanh toán, việc đang chờ.
function AdminDashboardPage() {
  const [range, setRange] = useState("30d");
  const { data: d, isLoading, isFetching, error } = useFinanceSummary(range);
  const { data: overview } = useAdminOverview();
  const badges = overview?.navBadges ?? {};
  const label = RANGES.find((r) => r.value === range).label;

  const queues = [
    { to: ROUTES.ADMIN.WITHDRAWALS, icon: Wallet, label: "Yêu cầu rút tiền chờ duyệt", count: badges.withdrawals },
    { to: ROUTES.ADMIN.REFUNDS, icon: ArrowLeftRight, label: "Yêu cầu hoàn tiền chờ xử lý", count: badges.refunds },
    { to: ROUTES.ADMIN.APPEALS, icon: Gavel, label: "Kháng nghị cảnh cáo chờ xét", count: badges.appeals },
  ];

  return (
    <div className="space-y-6 pb-6">
      <PageHeader title="Dashboard điều hành" description="Số liệu từ đơn đã thanh toán (trừ hoàn tiền). Ngày tính theo giờ Việt Nam.">
        {isFetching && !isLoading && <Loader2 size={16} className="animate-spin text-primary" />}
        <Tabs value={range} onChange={setRange} items={RANGES} label="Khoảng thời gian" />
        <button type="button" onClick={() => d && exportCsv(d, label)} disabled={!d} className="btn-ghost px-4 py-2 text-sm">
          <Download size={16} /> CSV
        </button>
      </PageHeader>

      {error && <p className="card p-5 text-danger">{error.message}</p>}
      {isLoading && <div className="h-96 animate-pulse rounded-stage bg-surface" />}
      {d && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Khách đã trả" value={money(d.revenue.grossRevenue)} hint={`${formatNumber(d.revenue.orders)} mục thanh toán • hoàn ${money(d.revenue.refunded)}`} />
            <StatCard label="Phần nền tảng giữ" value={money(d.revenue.platformRevenue)} hint={`Gói ${money(d.revenue.planRevenue)} + hoa hồng ${money(d.revenue.commission)}`} tone="text-primary-dark" />
            <StatCard label="Phải trả người bán" value={money(d.revenue.sellerPayable)} hint={`Truyện bán được ${money(d.revenue.listingGross)}`} />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <section className="card space-y-3 p-5 xl:col-span-2">
              <h2 className="text-lg">Doanh thu theo ngày</h2>
              <FinanceChart series={d.series} />
            </section>
            <div className="space-y-6">
              <section className="card space-y-2 p-5">
                <h2 className="text-lg">Việc đang chờ</h2>
                {queues.map((q) => (
                  <Link key={q.to} to={q.to} className="flex items-center gap-3 rounded-card px-2 py-2 hover:bg-surface">
                    <q.icon size={18} className="text-primary" />
                    <span className="flex-1 text-sm">{q.label}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-sm font-bold ${q.count ? "bg-danger text-white" : "bg-surface text-navy/60"}`}>{q.count ?? "—"}</span>
                  </Link>
                ))}
              </section>
              <section className="card space-y-2 p-5 text-sm">
                <h2 className="text-lg">Người dùng & tiền người bán</h2>
                <p>Phụ huynh mới ({label.toLowerCase()}): <b>{formatNumber(d.newParents)}</b></p>
                <p>Gói trả phí đang dùng: {d.activePaidSubscriptions.length ? d.activePaidSubscriptions.map((s) => `${s.plan} (${s.count})`).join(", ") : "chưa có"}</p>
                <p>Doanh thu người bán đang giữ: <b>{money(d.sellerFunds.pendingVnd)}</b></p>
                <p>Người bán rút được: <b>{money(d.sellerFunds.availableVnd)}</b></p>
                <p>
                  Đang rút: <b>{money(d.sellerFunds.lockedVnd)}</b> ({d.sellerFunds.withdrawalsInFlight.count} yêu cầu)
                </p>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboardPage;
