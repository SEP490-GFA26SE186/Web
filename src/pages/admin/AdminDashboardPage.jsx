import { useState } from "react";
import { AlertCircle, ArrowLeftRight, Banknote, Download, Gavel, HandCoins, Landmark, Loader2, Wallet } from "lucide-react";
import FinanceChart from "../../components/admin/FinanceChart";
import { RANGES, money } from "../../components/admin/adminFormat";
import { Badge, Button, Card, CardHeader, EmptyState, KeyValueList, ListRow, PageHeader, SegmentedControl, Skeleton, StatTile } from "../../components/ui";
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

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[132px] rounded-card" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <Skeleton className="h-[380px] rounded-card xl:col-span-2" />
        <div className="space-y-6">
          <Skeleton className="h-52 rounded-card" />
          <Skeleton className="h-52 rounded-card" />
        </div>
      </div>
    </div>
  );
}

// Dashboard điều hành: doanh thu thật từ đơn đã thanh toán, việc đang chờ.
function AdminDashboardPage() {
  const [range, setRange] = useState("30d");
  const { data: d, isLoading, isFetching, error, refetch } = useFinanceSummary(range);
  const { data: overview } = useAdminOverview();
  const badges = overview?.navBadges ?? {};
  const label = RANGES.find((r) => r.value === range).label;

  const queues = [
    { to: ROUTES.ADMIN.WITHDRAWALS, icon: Wallet, label: "Rút tiền chờ duyệt", count: badges.withdrawals },
    { to: ROUTES.ADMIN.REFUNDS, icon: ArrowLeftRight, label: "Hoàn tiền chờ xử lý", count: badges.refunds },
    { to: ROUTES.ADMIN.APPEALS, icon: Gavel, label: "Kháng nghị chờ xét", count: badges.appeals },
  ];
  const pendingTotal = queues.reduce((sum, q) => sum + (q.count ?? 0), 0);

  return (
    <div className="space-y-6 pb-6">
      <PageHeader title="Dashboard điều hành" description="Số liệu từ đơn đã thanh toán (trừ hoàn tiền). Ngày tính theo giờ Việt Nam.">
        {isFetching && !isLoading && <Loader2 size={16} className="animate-spin text-primary" aria-label="Đang cập nhật" />}
        <SegmentedControl value={range} onChange={setRange} items={RANGES} label="Khoảng thời gian" />
        <Button variant="secondary" icon={Download} onClick={() => d && exportCsv(d, label)} disabled={!d}>
          Xuất CSV
        </Button>
      </PageHeader>

      {error && (
        <Card>
          <EmptyState
            icon={AlertCircle}
            tone="danger"
            title="Không tải được số liệu tài chính"
            description={error.message}
            action={
              <Button variant="secondary" size="sm" onClick={() => refetch()}>
                Thử lại
              </Button>
            }
          />
        </Card>
      )}
      {isLoading && <DashboardSkeleton />}
      {d && (
        <div className={`space-y-6 transition-opacity duration-300 ${isFetching && !isLoading ? "opacity-70" : ""}`}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatTile
              index={0}
              icon={Banknote}
              tone="navy"
              label="Khách đã trả"
              value={money(d.revenue.grossRevenue)}
              hint={`${formatNumber(d.revenue.orders)} mục thanh toán, hoàn ${money(d.revenue.refunded)}`}
            />
            <StatTile
              index={1}
              icon={Landmark}
              tone="primary"
              emphasis
              label="Phần nền tảng giữ"
              value={money(d.revenue.platformRevenue)}
              hint={`Gói ${money(d.revenue.planRevenue)} + hoa hồng ${money(d.revenue.commission)}`}
            />
            <StatTile
              index={2}
              icon={HandCoins}
              tone="secondary"
              label="Phải trả người bán"
              value={money(d.revenue.sellerPayable)}
              hint={`Truyện bán được ${money(d.revenue.listingGross)}`}
              className="sm:col-span-2 xl:col-span-1"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card reveal index={3} className="xl:col-span-2 xl:self-start">
              <CardHeader title="Doanh thu theo ngày" description={`${label}, cột chồng theo nguồn doanh thu`} className="mb-4" />
              <FinanceChart series={d.series} />
            </Card>

            <div className="space-y-6">
              <Card reveal index={4}>
                <CardHeader
                  title="Việc đang chờ"
                  action={pendingTotal > 0 ? <Badge tone="danger">{pendingTotal} việc</Badge> : <Badge tone="secondary">Đã xong</Badge>}
                  className="mb-2"
                />
                <div>
                  {queues.map((q) => (
                    <ListRow
                      key={q.to}
                      to={q.to}
                      icon={q.icon}
                      iconTone={q.count ? "bg-primary-tint text-primary-dark" : "bg-navy/[0.05] text-navy/45"}
                      title={q.label}
                      trailing={<Badge tone={q.count ? "solidDanger" : "neutral"}>{q.count ?? 0}</Badge>}
                    />
                  ))}
                </div>
              </Card>

              <Card reveal index={5}>
                <CardHeader title="Người dùng & tiền người bán" className="mb-4" />
                <KeyValueList
                  items={[
                    { label: `Phụ huynh mới (${label.toLowerCase()})`, value: formatNumber(d.newParents) },
                    {
                      label: "Gói trả phí đang dùng",
                      value: d.activePaidSubscriptions.length ? d.activePaidSubscriptions.map((s) => `${s.plan}: ${s.count}`) : "Chưa có",
                    },
                    { label: "Doanh thu người bán đang giữ", value: money(d.sellerFunds.pendingVnd) },
                    { label: "Người bán rút được", value: money(d.sellerFunds.availableVnd) },
                    {
                      label: "Đang rút",
                      value: money(d.sellerFunds.lockedVnd),
                      hint: `${d.sellerFunds.withdrawalsInFlight.count} yêu cầu`,
                    },
                  ]}
                />
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
