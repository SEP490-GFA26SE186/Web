import { useState } from "react";
import { CheckCircle2, Loader2, RefreshCw, TriangleAlert } from "lucide-react";
import FinanceChart from "../../components/admin/FinanceChart";
import { LoadState, PageHeader, StatCard, Tabs } from "../../components/admin/AdminUi";
import { RANGES, formatDateTime, money } from "../../components/admin/adminFormat";
import { useFinanceSummary, useFixCounters, useReconciliation } from "../../hooks/useAdmin";
import { toast } from "../../stores/toastStore";
import { formatNumber } from "../../utils/format";

const REQUEST_TYPES = { story_text: "Viết truyện", narration: "Giọng đọc", character_portrait: "Chân dung nhân vật", scene_image: "Tranh cảnh" };
const STATUS = { succeeded: "Thành công", failed: "Lỗi", blocked: "Bị chặn", queued: "Đang chờ", processing: "Đang chạy" };

function Revenue({ d }) {
  const r = d.revenue;
  const rows = [
    ["Doanh thu gói", r.planRevenue, "Nền tảng giữ 100%"],
    ["Doanh thu truyện (giá bán)", r.listingGross, "Khách trả cho truyện ở Chợ"],
    ["− Phần người bán", -r.sellerPayable, "Chốt theo tỉ lệ lúc mua"],
    ["= Hoa hồng nền tảng", r.commission, ""],
    ["Đã hoàn tiền (không tính vào trên)", r.refunded, ""],
  ];
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Khách đã trả" value={money(r.grossRevenue)} hint={`${formatNumber(r.orders)} mục thanh toán`} />
        <StatCard label="Phần nền tảng giữ" value={money(r.platformRevenue)} tone="text-primary-dark" />
        <StatCard label="Phải trả người bán" value={money(r.sellerPayable)} />
      </div>
      <section className="card space-y-3 p-5">
        <FinanceChart series={d.series} />
        <table className="w-full text-sm">
          <tbody className="divide-y divide-outline">
            {rows.map(([label, v, note]) => (
              <tr key={label}><td className="py-2">{label}</td><td className="py-2 text-right font-bold">{money(v)}</td><td className="py-2 pl-4 text-xs text-navy/55">{note}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function AiCosts({ d }) {
  const a = d.aiCost;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Chi phí nhà cung cấp" value={money(a.totalVnd)} hint={`Tỉ giá ${formatNumber(a.usdVnd)} đ/USD`} />
        <StatCard label="Lượt gọi AI" value={formatNumber(a.requests)} hint={`${a.failed} lỗi / bị chặn (credit đã hoàn)`} />
        <StatCard label="Chi phí / phần nền tảng giữ" value={d.revenue.platformRevenue ? `${Math.round((a.totalVnd / d.revenue.platformRevenue) * 100)}%` : "—"} />
      </div>
      <section className="card overflow-x-auto">
        <LoadState empty={!a.breakdown.length} emptyText="Chưa có lượt gọi AI trong khoảng này." />
        {a.breakdown.length > 0 && (
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-outline text-left text-xs text-navy/60">
              <tr><th className="px-5 py-3">Loại</th><th>Nhà cung cấp</th><th>Trạng thái</th><th className="text-right">Lượt</th><th className="text-right">Credit thu</th><th className="text-right">Token vào / ra</th><th className="pr-5 text-right">Chi phí</th></tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {a.breakdown.map((b) => (
                <tr key={`${b.requestType}:${b.provider}:${b.status}`}>
                  <td className="px-5 py-2.5">{REQUEST_TYPES[b.requestType] ?? b.requestType}</td>
                  <td>{b.provider}</td>
                  <td>{STATUS[b.status] ?? b.status}</td>
                  <td className="text-right">{formatNumber(b.requests)}</td>
                  <td className="text-right">{formatNumber(b.credits)}</td>
                  <td className="text-right">{formatNumber(b.inputTokens)} / {formatNumber(b.outputTokens)}</td>
                  <td className="pr-5 text-right font-bold">{money(b.costVnd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

function CheckItem({ good, title, children }) {
  return (
    <div className="space-y-1">
      <p className={`flex items-center gap-2 font-bold ${good ? "text-secondary-dark" : "text-danger"}`}>
        {good ? <CheckCircle2 size={18} /> : <TriangleAlert size={18} />} {title}
      </p>
      {children}
    </div>
  );
}

function Reconciliation() {
  const { data, isLoading, error, refetch, isFetching } = useReconciliation();
  const fix = useFixCounters();
  const ok = (list) => !list.length;
  return (
    <section className="card space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg">Đối soát</h2>
          <p className="text-sm text-navy/60">Kiểm bất biến của sổ cái và bộ đếm. Không tự sửa số tiền — chỉ báo để kiểm tra.</p>
        </div>
        <button type="button" onClick={() => refetch()} disabled={isFetching} className="btn-ghost px-4 py-2 text-sm">
          <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} /> Kiểm lại
        </button>
      </div>
      <LoadState isLoading={isLoading} error={error} />
      {data && (
        <div className="space-y-4 text-sm">
          <p className="text-xs text-navy/50">Lúc {formatDateTime(data.checkedAt)} • {data.walletsChecked} ví</p>
          <CheckItem good={ok(data.walletMismatches)} title={ok(data.walletMismatches) ? "Số dư ví khớp sổ cái" : `${data.walletMismatches.length} ví lệch sổ cái`}>
            {data.walletMismatches.map((m) => (
              <p key={`${m.userId}:${m.walletType}`} className="text-navy/70">{m.userId} • {m.walletType}: ví {formatNumber(m.walletBalance)} ≠ sổ cái {formatNumber(m.ledgerBalance)}</p>
            ))}
          </CheckItem>
          <CheckItem good={ok(data.paidWithoutWebhook)} title={ok(data.paidWithoutWebhook) ? "Mọi đơn đã trả đều có webhook payOS hợp lệ" : `${data.paidWithoutWebhook.length} đơn đã trả nhưng chưa thấy webhook`}>
            {!ok(data.paidWithoutWebhook) && <p className="text-navy/60">Đơn được xác nhận khi hỏi lại payOS (người dùng quay về trang kết quả). Đối chiếu trên trang payOS nếu cần.</p>}
            {data.paidWithoutWebhook.slice(0, 10).map((o) => (
              <p key={o.orderId} className="text-navy/70">Mã {o.payosOrderCode} • {money(o.totalVnd)} • {formatDateTime(o.paidAt)}</p>
            ))}
          </CheckItem>
          <CheckItem good={ok(data.counterDrift)} title={ok(data.counterDrift) ? "Bộ đếm lượt mua của truyện khớp" : `${data.counterDrift.length} truyện lệch bộ đếm`}>
            {data.counterDrift.map((c) => (
              <p key={c.listingId} className="text-navy/70">{c.title}: mua {c.purchaseCount} → {c.paidActual}, nhận miễn phí {c.freeClaimCount} → {c.freeActual}</p>
            ))}
            {!ok(data.counterDrift) && (
              <button type="button" disabled={fix.isPending} onClick={() => fix.mutate(undefined, { onSuccess: ({ fixed }) => toast.success(`Đã tính lại ${fixed} truyện`), onError: (e) => toast.error(e.message) })} className="btn-primary mt-1 px-4 py-2 text-sm">
                {fix.isPending && <Loader2 size={15} className="animate-spin" />} Tính lại bộ đếm
              </button>
            )}
          </CheckItem>
        </div>
      )}
    </section>
  );
}

function ProfitLoss({ d }) {
  const p = d.pnl;
  const rows = [
    ["Doanh thu gói", d.revenue.planRevenue],
    ["Hoa hồng chợ truyện", d.revenue.commission],
    ["= Doanh thu nền tảng", p.platformRevenue],
    ["− Chi phí AI (nhà cung cấp)", -p.aiCostVnd],
    ["= Lãi gộp", p.grossProfit],
  ];
  return (
    <>
      <section className="card space-y-3 p-5">
        <table className="w-full max-w-xl text-sm">
          <tbody className="divide-y divide-outline">
            {rows.map(([label, v]) => (
              <tr key={label} className={label.startsWith("=") ? "font-bold" : ""}><td className="py-2">{label}</td><td className={`py-2 text-right ${v < 0 ? "text-danger" : ""}`}>{money(v)}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="text-sm text-navy/60">
          Biên lãi gộp: <b>{p.margin == null ? "—" : `${Math.round(p.margin * 100)}%`}</b>. Chưa tính phí cổng thanh toán, hạ tầng, nhân sự — đây là lãi gộp theo chi phí biến đổi của AI.
        </p>
      </section>
      <Reconciliation />
    </>
  );
}

const VIEWS = {
  revenue: { title: "Báo cáo doanh thu", description: "Doanh thu gói và chợ truyện theo ngày; hoàn tiền đã trừ.", Body: Revenue },
  "ai-costs": { title: "Chi phí vận hành AI", description: "Chi phí nhà cung cấp theo loại tác vụ, so với credit đã thu.", Body: AiCosts },
  "profit-loss": { title: "Lãi lỗ & đối soát", description: "Lãi gộp theo chi phí AI và kiểm tra bất biến của sổ cái.", Body: ProfitLoss },
};

/** Ba trang tài chính dùng chung số liệu /admin/finance/summary — `view`: revenue | ai-costs | profit-loss. */
function FinanceReportPage({ view }) {
  const [range, setRange] = useState("30d");
  const { data, isLoading, isFetching, error } = useFinanceSummary(range);
  const { title, description, Body } = VIEWS[view];
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description}>
        {isFetching && !isLoading && <Loader2 size={16} className="animate-spin text-primary" />}
        <Tabs value={range} onChange={setRange} items={RANGES} label="Khoảng thời gian" />
      </PageHeader>
      <LoadState isLoading={isLoading} error={error} />
      {data && <Body d={data} />}
    </div>
  );
}

export default FinanceReportPage;
