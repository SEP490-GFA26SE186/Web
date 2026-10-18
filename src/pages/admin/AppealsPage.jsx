import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, X } from "lucide-react";
import { PageHeader, Tabs } from "../../components/admin/AdminUi";
import api, { getErrorMessage } from "../../services/api";
import { APPEAL_STATUS, STRIKE_SOURCES, formatDate, formatDateTime } from "../../constants/moderation";
import { toast } from "../../stores/toastStore";

const call = async (request) => {
  try {
    return (await request).data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error), { cause: error });
  }
};

const TABS = [
  { value: "pending", label: "Chờ xét" },
  { value: "approved", label: "Đã chấp thuận" },
  { value: "rejected", label: "Đã từ chối" },
];

// Kháng nghị cảnh cáo: Admin (khác người ra cảnh cáo) xét. Chấp thuận → gỡ cảnh cáo; nếu còn dưới ngưỡng
// thì tài khoản bán đang khoá được mở lại. Từ chối phải ghi lý do.
function AppealsPage() {
  const [status, setStatus] = useState("pending");
  const [notes, setNotes] = useState({});
  const queryClient = useQueryClient();
  const { data: appeals = [], isLoading, error } = useQuery({
    queryKey: ["admin", "appeals", status],
    queryFn: async () => (await call(api.get("/admin/appeals", { params: { status } }))).appeals,
  });
  const decide = useMutation({
    mutationFn: ({ id, approve }) => call(api.post(`/admin/appeals/${id}/decision`, { approve, note: notes[id]?.trim() || undefined })),
    onSuccess: ({ status: s, sellerReinstated }) => {
      toast.success(s === "approved" ? `Đã gỡ cảnh cáo${sellerReinstated ? " và mở lại tài khoản bán" : ""}` : "Đã từ chối kháng nghị");
      queryClient.invalidateQueries({ queryKey: ["admin", "appeals"] });
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <PageHeader title="Kháng nghị cảnh cáo" description="Người bán kháng nghị cảnh cáo từ Kiểm duyệt viên. Chấp nhận → gỡ cảnh cáo (và mở lại quyền bán nếu đủ điều kiện)." />
      <Tabs value={status} onChange={setStatus} items={TABS} />
      <div className="card space-y-4 p-5">
      {isLoading && <Loader2 size={24} className="animate-spin text-primary" />}
      {error && <p className="text-danger">{error.message}</p>}
      {!isLoading && !error && appeals.length === 0 && <p className="text-navy/60">Không có kháng nghị nào.</p>}
      <ul className="divide-y divide-outline">
        {appeals.map((a) => {
          const busy = decide.isPending && decide.variables?.id === a.id;
          const st = APPEAL_STATUS[a.status];
          return (
            <li key={a.id} className="space-y-2 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold">{a.strike.seller.displayName}</p>
                {a.strike.seller.status === "suspended" && <span className="rounded-full bg-danger px-2 py-0.5 text-xs font-bold text-white">Tài khoản bán đang khoá</span>}
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${st?.tone}`}>{st?.label}</span>
              </div>
              <div className="rounded-card bg-surface p-3 text-sm">
                <p>
                  <b>Cảnh cáo</b> ({STRIKE_SOURCES[a.strike.source]}, {formatDate(a.strike.issuedAt)}, bởi {a.strike.issuer?.name}): {a.strike.reason}
                </p>
                <p className="mt-1">
                  <b>Kháng nghị</b> ({formatDateTime(a.createdAt)}): {a.reason}
                </p>
                {a.decisionNote && (
                  <p className="mt-1">
                    <b>Quyết định</b> của {a.decider}: {a.decisionNote}
                  </p>
                )}
              </div>
              {a.status === "pending" && (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    value={notes[a.id] ?? ""}
                    onChange={(e) => setNotes((m) => ({ ...m, [a.id]: e.target.value }))}
                    placeholder="Ghi chú cho người bán (bắt buộc khi từ chối)"
                    aria-label="Ghi chú quyết định"
                    className="min-w-64 flex-1 rounded-full border-2 border-outline px-4 py-2 text-sm"
                  />
                  <button type="button" disabled={busy} onClick={() => decide.mutate({ id: a.id, approve: true })} className="btn-primary px-4 py-2 text-sm">
                    {busy ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Chấp thuận
                  </button>
                  <button type="button" disabled={busy} onClick={() => decide.mutate({ id: a.id, approve: false })} className="btn-ghost px-4 py-2 text-sm text-danger">
                    <X size={15} /> Từ chối
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      </div>
    </div>
  );
}

export default AppealsPage;
