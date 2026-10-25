import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Ban, Clock, ExternalLink, Loader2, Pencil, Store } from "lucide-react";
import { coverOf } from "../../../components/parent/library/storyMeta";
import StoryCover from "../../../components/parent/StoryCover";
import EarningsPanel from "../../../components/parent/selling/EarningsPanel";
import StrikesPanel from "../../../components/parent/selling/StrikesPanel";
import { LISTING_STATUS } from "../../../constants/moderation";
import { ROUTES } from "../../../constants/routes";
import { applySeller, getMyListings, getMySeller, retryNarration, updateMySeller } from "../../../services/sellingService";
import { toast } from "../../../stores/toastStore";
import { formatListingPrice } from "../../../utils/format";


const field = "w-full rounded-card border-2 border-outline px-4 py-2.5 focus:border-primary focus:outline-none";

// Nộp hồ sơ bán (chưa có / bị từ chối) hoặc sửa hồ sơ (`seller` đang chờ duyệt / đã duyệt).
function ApplyForm({ seller, onDone, onCancel }) {
  const editing = !!seller;
  const [form, setForm] = useState({ displayName: seller?.displayName ?? "", bio: seller?.bio ?? "", expertise: seller?.expertise ?? "" });
  const apply = useMutation({ mutationFn: editing ? updateMySeller : applySeller });
  const submit = (e) => {
    e.preventDefault();
    const body = editing
      ? { displayName: form.displayName, bio: form.bio, expertise: form.expertise } // chuỗi rỗng = xoá
      : { displayName: form.displayName, bio: form.bio || undefined, expertise: form.expertise || undefined };
    apply.mutate(body, {
      onSuccess: () => {
        toast.success(editing ? "Đã cập nhật hồ sơ bán" : "Đã gửi hồ sơ, chuyên gia sẽ duyệt sớm");
        onDone();
      },
      onError: (err) => toast.error(err.message),
    });
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Biệt danh công khai</span>
        <input required minLength={2} maxLength={100} value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} placeholder="Nhập tên hiển thị trên chợ truyện" className={field} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Giới thiệu (không bắt buộc)</span>
        <textarea rows={3} maxLength={2000} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={field} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Chuyên môn / kinh nghiệm (không bắt buộc)</span>
        <input maxLength={1000} value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} placeholder="Kinh nghiệm hoặc chuyên môn của ba mẹ (không bắt buộc)" className={field} />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={apply.isPending} className="btn-primary">
          {apply.isPending && <Loader2 size={16} className="animate-spin" />} {editing ? "Lưu hồ sơ" : "Gửi hồ sơ"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost">
            Huỷ
          </button>
        )}
      </div>
    </form>
  );
}

/** Giọng đọc của bản đăng bán (sinh lại bằng tên chung). Chuyên gia chỉ nhận duyệt khi đọc xong. */
function NarrationStatus({ listing: l }) {
  const queryClient = useQueryClient();
  const retry = useMutation({
    mutationFn: () => retryNarration(l.publishedStoryId),
    onSuccess: () => {
      toast.success("Đang tạo lại giọng đọc");
      queryClient.invalidateQueries({ queryKey: ["selling", "listings"] });
    },
    onError: (e) => toast.error(e.message),
  });
  if (!l.hasNarration) return <p className="text-xs text-navy/50">Chỉ có chữ (không giọng đọc)</p>;
  const n = l.narration;
  if (!n || n.complete) return <p className="text-xs font-semibold text-secondary-dark">Có giọng đọc</p>;
  const broken = n.failed > 0 || n.missing > 0;
  return (
    <p className={`flex flex-wrap items-center gap-2 text-xs font-semibold ${broken ? "text-danger" : "text-primary-dark"}`}>
      {broken ? `Giọng đọc lỗi ${n.failed + n.missing}/${n.total} đoạn — chuyên gia chưa duyệt được` : `Đang tạo giọng đọc ${n.ready}/${n.total} đoạn — xong mới vào hàng chờ duyệt`}
      {broken && (
        <button type="button" onClick={() => retry.mutate()} disabled={retry.isPending} className="rounded-full bg-danger px-3 py-0.5 text-white disabled:opacity-60">
          Tạo lại giọng đọc
        </button>
      )}
    </p>
  );
}

// Bán truyện: hồ sơ người bán (cần gói được bán) + danh sách truyện đã đăng và kết quả duyệt.
function SellingPage() {
  const queryClient = useQueryClient();
  const { data: me, isLoading } = useQuery({ queryKey: ["selling", "me"], queryFn: getMySeller });
  const { data: listings = [] } = useQuery({ queryKey: ["selling", "listings"], queryFn: getMyListings, refetchInterval: (q) => (q.state.data?.some((l) => l.narration && !l.narration.complete && !l.narration.failed && !l.narration.missing) ? 10_000 : false), enabled: ["approved", "suspended"].includes(me?.seller?.status) });
  const status = me?.seller?.status;
  const [editingProfile, setEditingProfile] = useState(false);
  const refreshMe = () => {
    setEditingProfile(false);
    queryClient.invalidateQueries({ queryKey: ["selling", "me"] });
  };
  const isSeller = status === "approved" || status === "suspended";

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
        ) : editingProfile && (status === "approved" || status === "pending") ? (
          <>
            <h2 className="flex items-center gap-2 text-lg">
              <Pencil size={18} className="text-primary" /> Sửa hồ sơ bán
            </h2>
            <ApplyForm seller={me.seller} onCancel={() => setEditingProfile(false)} onDone={refreshMe} />
          </>
        ) : status === "approved" ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 font-bold text-secondary-dark">
              <BadgeCheck size={20} /> Ba mẹ là người bán: {me.seller.displayName}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link to={ROUTES.PARENT.marketplaceSeller(me.seller.userId)} className="btn-ghost px-4 py-2 text-sm">
                <ExternalLink size={16} /> Xem trang công khai
              </Link>
              <button type="button" onClick={() => setEditingProfile(true)} className="btn-ghost px-4 py-2 text-sm">
                <Pencil size={16} /> Sửa hồ sơ
              </button>
            </div>
          </div>
        ) : status === "suspended" ? (
          <div className="space-y-1">
            <p className="flex items-center gap-2 font-bold text-danger">
              <Ban size={20} /> Tài khoản bán “{me.seller.displayName}” đang bị khoá
            </p>
            <p className="text-sm text-navy/70">
              Do có đủ cảnh cáo còn hiệu lực. Truyện của ba mẹ tạm ẩn khỏi Chợ truyện và chưa đăng bán mới được. Ba mẹ có thể kháng nghị từng cảnh cáo bên dưới; doanh thu đã có vẫn rút được.
            </p>
          </div>
        ) : status === "pending" ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 font-semibold text-primary-dark">
              <Clock size={20} /> Hồ sơ “{me.seller.displayName}” đang chờ chuyên gia duyệt.
            </p>
            <button type="button" onClick={() => setEditingProfile(true)} className="btn-ghost px-4 py-2 text-sm">
              <Pencil size={16} /> Sửa hồ sơ
            </button>
          </div>
        ) : (
          <>
            <h2 className="flex items-center gap-2 text-lg">
              <Store size={20} className="text-primary" /> {status === "rejected" ? "Hồ sơ chưa được duyệt — nộp lại" : "Đăng ký làm người bán"}
            </h2>
            <ApplyForm onDone={() => queryClient.invalidateQueries({ queryKey: ["selling", "me"] })} />
          </>
        )}
      </section>

      {isSeller && <StrikesPanel />}

      {isSeller && <EarningsPanel />}

      {isSeller && (
        <section className="card space-y-3 p-6">
          <h2 className="text-lg">Truyện đã đăng bán</h2>
          <p className="text-sm text-navy/60">Mở một truyện đã hoàn tất trong “Sáng tác truyện” rồi bấm “Đăng bán”.</p>
          {listings.length === 0 && <p className="text-navy/60">Chưa có truyện nào.</p>}
          <ul className="divide-y divide-outline">
            {listings.map((l) => {
              const s = LISTING_STATUS[l.status] ?? { label: l.status, tone: "bg-surface" };
              return (
                <li key={l.id} className="flex items-start gap-3 py-3">
                  <StoryCover cover={coverOf(l)} title={l.title} size="sm" className="h-16 w-16 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">{l.title}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${s.tone}`}>{s.label}</span>
                      <span className="text-sm text-navy/60">{formatListingPrice(l.priceVnd)}</span>
                    </div>
                    <NarrationStatus listing={l} />
                    {l.lastDecision?.comment && <p className="text-sm text-navy/70">Chuyên gia: {l.lastDecision.comment}</p>}
                  </div>
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
