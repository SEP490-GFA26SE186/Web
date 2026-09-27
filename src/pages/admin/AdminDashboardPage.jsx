import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import ActionQueues from "../../components/admin/ActionQueues";
import { PipelineSection, PricingSection, RevenueSection } from "../../components/admin/DashboardSections";
import KpiCards from "../../components/admin/KpiCards";
import { useAdminDashboard } from "../../hooks/useAdmin";
import { DATE_RANGES } from "../../mocks/admin";
import { toast } from "../../stores/toastStore";
import { downloadCsv } from "../../utils/format";

// Xuất số liệu kỳ đang xem ra CSV (Excel mở trực tiếp được)
const exportReport = (data, rangeLabel) => {
  const k = data.kpis;
  const rows = [
    ["Báo cáo điều hành StoryWeaver AI", rangeLabel],
    [],
    ["Chỉ số", "Giá trị"],
    ["Tổng phụ huynh", k.parents.total],
    ["Tác giả hoạt động", k.sellers.active],
    ["Thuê bao Gia Đình", k.subscriptions.total],
    ["GMV Chợ truyện (VND)", k.gmv.amount],
    ["Số giao dịch", k.gmv.transactions],
    ["Hoa hồng nền tảng (VND)", k.commission.amount],
    ["Chi phí hạ tầng AI (VND)", k.aiCost.amount],
    ["Lệnh rút tiền chờ duyệt", k.pendingWithdrawals.count],
    [],
    ["Nguồn thu", "Số tiền (VND)", "Tỷ trọng (%)"],
    ...data.revenueBreakdown.map((b) => [b.label, b.amount, b.share]),
    [],
    ["Tuần", "Doanh thu gộp (triệu VND)", "Chi phí AI (triệu VND)"],
    ...data.revenueSeries.labels.map((l, i) => [l, data.revenueSeries.revenue[i], data.revenueSeries.aiCost[i]]),
  ];
  downloadCsv(`storyweaver-bao-cao-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  toast.success("Đã xuất báo cáo CSV (mở được bằng Excel)");
};

function AdminDashboardPage() {
  const [range, setRange] = useState("7d");
  const { data, isLoading, isFetching } = useAdminDashboard(range);
  const rangeLabel = DATE_RANGES.find((r) => r.value === range).label;

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="rounded-full bg-primary-tint px-3 py-0.5 tracking-wide text-primary-dark uppercase">Cổng Quản Trị Trung Tâm</span>
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            <span className="text-secondary-dark">Dữ liệu thời gian thực</span>
            {isFetching && !isLoading && <Loader2 size={14} className="animate-spin text-primary" />}
          </div>
          <h1 className="text-3xl">Bàn điều hành doanh nghiệp</h1>
          <p className="max-w-3xl text-navy/70">
            Giám sát hiệu suất kinh doanh, dòng tiền nền tảng, chi phí vận hành AI và các vụ việc phê duyệt tài chính StoryWeaver AI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 self-start rounded-full bg-surface p-1.5 shadow-low xl:self-auto">
          {DATE_RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              aria-pressed={range === r.value}
              className={`rounded-full px-4 py-1.5 text-sm transition ${
                range === r.value ? "bg-white font-bold text-primary-dark shadow-low" : "font-semibold text-navy/60 hover:text-navy"
              }`}
            >
              {r.label}
            </button>
          ))}
          <button
            disabled={!data}
            onClick={() => exportReport(data, rangeLabel)}
            className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-primary-dark px-4 py-2 text-sm font-bold text-white shadow-mid transition hover:bg-primary active:scale-95 disabled:opacity-50"
          >
            <Download size={17} /> Xuất báo cáo Excel (CSV)
          </button>
        </div>
      </div>

      {isLoading || !data ? (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-2 gap-3 2xl:grid-cols-7">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-36 rounded-card bg-surface" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-96 rounded-stage bg-surface" />
            ))}
          </div>
        </div>
      ) : (
        <div className={`flex flex-col gap-6 transition-opacity ${isFetching ? "opacity-70" : ""}`}>
          <KpiCards kpis={data.kpis} />
          <ActionQueues withdrawals={data.withdrawals} appeals={data.appeals} refunds={data.refunds} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <RevenueSection series={data.revenueSeries} breakdown={data.revenueBreakdown} />
            <PricingSection tiers={data.pricingTiers} escrow={data.escrow} />
          </div>
          <PipelineSection nodes={data.pipeline} />
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
