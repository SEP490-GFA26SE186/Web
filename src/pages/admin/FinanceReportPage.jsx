import { useState } from "react";
import { CheckCircle2, Loader2, RefreshCw, TriangleAlert } from "lucide-react";
import FinanceChart from "../../components/admin/FinanceChart";
import { LoadState, PageHeader, StatCard, Tabs } from "../../components/admin/AdminUi";
import { RANGES, formatDateTime, money } from "../../components/admin/adminFormat";
import { useFinanceSummary, useFixCounters, useReconciliation } from "../../hooks/useAdmin";
import { toast } from "../../stores/toastStore";
import { formatNumber } from "../../utils/format";

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

// Báo cáo doanh thu (/admin/finance/summary) + đối soát sổ cái ở cuối trang. Không có màn chi phí AI / lãi lỗ: chữ chạy Claude theo gói
// thuê bao, ảnh dùng free tier — chi phí biến đổi bằng 0 nên không tính được.
function FinanceReportPage() {
  const [range, setRange] = useState("30d");
  const { data, isLoading, isFetching, error } = useFinanceSummary(range);
  return (
    <div className="space-y-6">
      <PageHeader title="Báo cáo doanh thu" description="Doanh thu gói và chợ truyện theo ngày; hoàn tiền đã trừ. Cuối trang: đối soát sổ cái.">
        {isFetching && !isLoading && <Loader2 size={16} className="animate-spin text-primary" />}
        <Tabs value={range} onChange={setRange} items={RANGES} label="Khoảng thời gian" />
      </PageHeader>
      <LoadState isLoading={isLoading} error={error} />
      {data && <Revenue d={data} />}
      <Reconciliation />
    </div>
  );
}

export default FinanceReportPage;
