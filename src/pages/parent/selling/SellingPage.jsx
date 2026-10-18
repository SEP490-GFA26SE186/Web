import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Clock, Loader2, Store } from "lucide-react";
import { ROUTES } from "../../../constants/routes";
import { applySeller, getMyListings, getMySeller } from "../../../services/sellingService";
import { toast } from "../../../stores/toastStore";
import { formatNumber } from "../../../utils/format";

const LISTING_STATUS = {
  submitted: { label: "Chờ duyệt", tone: "bg-navy-tint text-navy" },
  in_review: { label: "Đang duyệt", tone: "bg-primary-tint text-primary-dark" },
  changes_requested: { label: "Cần sửa", tone: "bg-danger-tint text-danger" },
  rejected: { label: "Bị từ chối", tone: "bg-danger-tint text-danger" },
  published: { label: "Đang bán", tone: "bg-secondary-tint text-secondary-dark" },
  suspended: { label: "Tạm gỡ", tone: "bg-danger-tint text-danger" },
  archived: { label: "Đã lưu trữ", tone: "bg-navy-tint text-navy" },
};

const field = "w-full rounded-card border-2 border-outline px-4 py-2.5 focus:border-primary focus:outline-none";

function ApplyForm({ onDone }) {
  const [form, setForm] = useState({ displayName: "", bio: "", expertise: "" });
  const apply = useMutation({ mutationFn: applySeller });
  const submit = (e) => {
    e.preventDefault();
    apply.mutate(
      { displayName: form.displayName, bio: form.bio || undefined, expertise: form.expertise || undefined },
      { onSuccess: () => { toast.success("Đã gửi hồ sơ, Moderator sẽ duyệt sớm"); onDone(); }, onError: (err) => toast.error(err.message) },
    );
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Biệt danh công khai</span>
        <input required minLength={2} maxLength={100} value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="VD: Mẹ Mít kể chuyện" className={field} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Giới thiệu (không bắt buộc)</span>
        <textarea rows={3} maxLength={2000} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={field} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Chuyên môn / kinh nghiệm (không bắt buộc)</span>
        <input maxLength={1000} value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} placeholder="VD: giáo viên mầm non 5 năm" className={field} />
      </label>
      <button type="submit" disabled={apply.isPending} className="btn-primary">
        {apply.isPending && <Loader2 size={16} className="animate-spin" />} Gửi hồ sơ
      </button>
    </form>
  );
}

// Bán truyện: hồ sơ người bán (cần gói được bán) + danh sách truyện đã đăng và kết quả duyệt.
function SellingPage() {
  const queryClient = useQueryClient();
  const { data: me, isLoading } = useQuery({ queryKey: ["selling", "me"], queryFn: getMySeller });
  const { data: listings = [] } = useQuery({ queryKey: ["selling", "listings"], queryFn: getMyListings, enabled: me?.seller?.status === "approved" });
  const status = me?.seller?.status;

  if (isLoading) return <Loader2 size={32} className="animate-spin text-primary" />;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl">Bán truyện</h1>
        <p className="mt-1 text-navy/60">Đăng bán truyện ba mẹ đã viết lên Chợ truyện. Tên thật của gia đình được thay bằng tên chung trước khi đăng.</p>
      </div>

      <section className="card space-y-4 p-6">
        {!me?.planCanSell && status !== "approved" ? (
          <p className="text-navy/70">
            Gói hiện tại chưa cho phép đăng bán.{" "}
            <Link to={ROUTES.PARENT.BILLING} className="font-bold text-primary hover:underline">
              Nâng cấp gói Gia đình
            </Link>{" "}
            để mở tính năng này.
          </p>
        ) : status === "approved" ? (
          <p className="flex items-center gap-2 font-bold text-secondary-dark">
            <BadgeCheck size={20} /> Ba mẹ là người bán: {me.seller.displayName}
          </p>
        ) : status === "pending" ? (
          <p className="flex items-center gap-2 font-semibold text-primary-dark">
            <Clock size={20} /> Hồ sơ “{me.seller.displayName}” đang chờ Moderator duyệt.
          </p>
        ) : (
          <>
            <h2 className="flex items-center gap-2 text-lg">
              <Store size={20} className="text-primary" /> {status === "rejected" ? "Hồ sơ chưa được duyệt — nộp lại" : "Đăng ký làm người bán"}
            </h2>
            <ApplyForm onDone={() => queryClient.invalidateQueries({ queryKey: ["selling", "me"] })} />
          </>
        )}
      </section>

      {status === "approved" && (
        <section className="card space-y-3 p-6">
          <h2 className="text-lg">Truyện đã đăng bán</h2>
          <p className="text-sm text-navy/60">Mở một truyện đã hoàn tất trong “Sáng tác truyện” rồi bấm “Đăng bán”.</p>
          {listings.length === 0 && <p className="text-navy/60">Chưa có truyện nào.</p>}
          <ul className="divide-y divide-outline">
            {listings.map((l) => {
              const s = LISTING_STATUS[l.status] ?? { label: l.status, tone: "bg-surface" };
              return (
                <li key={l.id} className="space-y-1 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold">{l.title}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${s.tone}`}>{s.label}</span>
                    <span className="text-sm text-navy/60">{l.priceVnd ? `${formatNumber(l.priceVnd)}đ` : "Miễn phí"}</span>
                  </div>
                  {l.lastDecision?.comment && <p className="text-sm text-navy/70">Moderator: {l.lastDecision.comment}</p>}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

export default SellingPage;
