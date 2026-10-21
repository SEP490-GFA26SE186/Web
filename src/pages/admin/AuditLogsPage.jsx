import { useState } from "react";
import Pagination from "../../components/common/Pagination";
import { LoadState, PageHeader } from "../../components/admin/AdminUi";
import { formatDateTime } from "../../components/admin/adminFormat";
import { useAuditLogs } from "../../hooks/useAdmin";

const ACTION_LABELS = {
  "account.lock": "Khoá tài khoản",
  "account.unlock": "Mở khoá tài khoản",
  "account.create_moderator": "Tạo Chuyên gia sư phạm",
  "plan.create": "Tạo gói",
  "plan.update": "Sửa gói",
  "price_tier.create": "Thêm bậc giá",
  "price_tier.update": "Sửa bậc giá",
  "setting.update": "Sửa cấu hình",
  "refund.approved": "Duyệt hoàn tiền",
  "refund.rejected": "Từ chối hoàn tiền",
  "appeal.approved": "Chấp thuận kháng nghị",
  "appeal.rejected": "Từ chối kháng nghị",
  "strike.issue": "Cảnh cáo tác giả",
  "listing.suspend": "Tạm gỡ truyện",
  "report.dismiss": "Bác báo cáo",
  "audit.schedule": "Chọn đợt kiểm tra ngẫu nhiên",
  "reconcile.fix_counters": "Tính lại bộ đếm truyện",
};
const PREFIX_LABELS = {
  all: "Tất cả", account: "Tài khoản", plan: "Gói", price_tier: "Bậc giá", setting: "Cấu hình", refund: "Hoàn tiền",
  withdrawal: "Rút tiền", appeal: "Kháng nghị", strike: "Cảnh cáo", listing: "Truyện", report: "Báo cáo", audit: "Kiểm tra", reconcile: "Đối soát",
};
const ROLE = { admin: "Admin", specialist: "Chuyên gia sư phạm", parent: "Phụ huynh" };

/** Tóm tắt trạng thái trước → sau (JSON nhỏ). */
const brief = (v) => (v == null ? "" : typeof v === "object" ? Object.entries(v).map(([k, x]) => `${k}: ${typeof x === "object" ? JSON.stringify(x) : x}`).join(", ") : String(v));

// Nhật ký thao tác của Admin và Chuyên gia sư phạm (admin_audit_logs) — chỉ ghi thêm.
function AuditLogsPage() {
  const [action, setAction] = useState("all");
  const [page, setPage] = useState(1);
  const { data, isLoading, error, isFetching } = useAuditLogs({ action, page });
  const logs = data?.logs ?? [];
  return (
    <div className="space-y-5">
      <PageHeader title="Nhật ký kiểm toán" description="Mọi thao tác thay đổi tiền, quyền và nội dung của Admin / Chuyên gia sư phạm.">
        <select value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }} aria-label="Loại thao tác" className="cursor-pointer rounded-full border-[1.5px] border-outline bg-white px-4 py-2 text-sm">
          {["all", ...(data?.prefixes ?? [])].map((p) => <option key={p} value={p}>{PREFIX_LABELS[p] ?? p}</option>)}
        </select>
      </PageHeader>
      <section className={`card overflow-x-auto transition-opacity ${isFetching && !isLoading ? "opacity-60" : ""}`}>
        <LoadState isLoading={isLoading} error={error} empty={!logs.length} emptyText="Chưa có thao tác nào." />
        {logs.length > 0 && (
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-outline text-left text-xs text-navy/60">
              <tr><th className="px-5 py-3">Thời điểm</th><th>Người làm</th><th>Thao tác</th><th className="pr-5">Chi tiết</th></tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {logs.map((l) => (
                <tr key={l.id} className="align-top">
                  <td className="px-5 py-2.5 whitespace-nowrap">{formatDateTime(l.createdAt)}</td>
                  <td className="py-2.5">{l.actor.name} <span className="text-xs text-navy/50">({ROLE[l.actor.role]})</span></td>
                  <td className="py-2.5 font-semibold">{ACTION_LABELS[l.action] ?? l.action}</td>
                  <td className="py-2.5 pr-5 text-xs text-navy/65">
                    {l.beforeState && <p>Trước: {brief(l.beforeState)}</p>}
                    {l.afterState && <p>Sau: {brief(l.afterState)}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      {data?.pagination.totalPages > 1 && <Pagination page={page} totalPages={data.pagination.totalPages} onChange={setPage} />}
    </div>
  );
}

export default AuditLogsPage;
