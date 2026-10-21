import { useState } from "react";
import { Check, IdCard, Loader2, X } from "lucide-react";
import { useDecideSeller, useSellerApplications } from "../../hooks/useSpecialist";
import { toast } from "../../stores/toastStore";

const TABS = [
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
];

// Duyệt hồ sơ người bán: phụ huynh có gói được bán truyện nộp biệt danh + giới thiệu.
function SellerApplicationsPage() {
  const [status, setStatus] = useState("pending");
  const { data: sellers = [], isLoading } = useSellerApplications(status);
  const decide = useDecideSeller();

  const act = (s, approve) =>
    decide.mutate(
      { userId: s.userId, approve },
      { onSuccess: () => toast.success(approve ? `Đã duyệt ${s.displayName}` : `Đã từ chối ${s.displayName}`), onError: (e) => toast.error(e.message) },
    );

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
          <IdCard size={16} /> Kiểm duyệt
        </p>
        <h1 className="text-3xl">Hồ sơ người bán</h1>
        <p className="mt-1 max-w-2xl text-navy/70">Phụ huynh đăng ký bán truyện — duyệt để mở quyền đăng bán trên Chợ truyện.</p>
      </div>
      <div className="flex flex-wrap gap-2" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={status === t.value}
            onClick={() => setStatus(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${status === t.value ? "bg-primary text-white" : "bg-surface text-navy/70"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="card space-y-4 p-5">
      {isLoading && <Loader2 size={24} className="animate-spin text-primary" />}
      {!isLoading && sellers.length === 0 && <p className="text-navy/60">Không có hồ sơ nào.</p>}
      <ul className="divide-y divide-outline">
        {sellers.map((s) => {
          const busy = decide.isPending && decide.variables?.userId === s.userId;
          return (
            <li key={s.userId} className="flex flex-wrap items-start gap-4 py-4">
              <div className="min-w-0 flex-1 space-y-1">
                <p className="font-bold">
                  {s.displayName} <span className="font-normal text-navy/50">({s.fullName} • {s.email})</span>
                </p>
                {s.bio && <p className="text-sm text-navy/70">{s.bio}</p>}
                {s.expertise && <p className="text-sm text-navy/60">Chuyên môn: {s.expertise}</p>}
                <p className="text-xs text-navy/50">Nộp lúc {new Date(s.createdAt).toLocaleString("vi-VN")}</p>
              </div>
              {status === "pending" && (
                <div className="flex gap-2">
                  <button type="button" disabled={busy} onClick={() => act(s, false)} className="btn-ghost px-4 py-2 text-sm text-danger">
                    <X size={16} /> Từ chối
                  </button>
                  <button type="button" disabled={busy} onClick={() => act(s, true)} className="btn-primary px-4 py-2 text-sm">
                    {busy ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Duyệt
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

export default SellerApplicationsPage;
