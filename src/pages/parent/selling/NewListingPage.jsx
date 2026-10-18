import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { ROUTES } from "../../../constants/routes";
import { useStory } from "../../../hooks/useStudio";
import { createListing, getPriceTiers } from "../../../services/sellingService";
import { toast } from "../../../stores/toastStore";

const field = "w-full rounded-card border-2 border-outline px-4 py-2.5 focus:border-primary focus:outline-none";

// Đăng bán một truyện riêng đã hoàn tất: tên mới, mô tả, giá, tên chung cho từng nhân vật.
// BE tạo bản sao đã gỡ cá nhân hoá (không chuyện thật, không giọng đọc) và gửi Moderator duyệt.
function NewListingPage() {
  const [params] = useSearchParams();
  const storyId = params.get("storyId");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: story, isLoading } = useStory(storyId);
  const { data: tiers = [] } = useQuery({ queryKey: ["selling", "tiers"], queryFn: getPriceTiers });
  const [form, setForm] = useState({ title: "", description: "", priceTierId: "" });
  const [aliases, setAliases] = useState({});
  const [errors, setErrors] = useState({});
  const create = useMutation({ mutationFn: createListing });

  if (isLoading) return <Loader2 size={32} className="animate-spin text-primary" />;
  if (!story) return <p className="card p-6">Không tìm thấy truyện.</p>;

  const submit = (e) => {
    e.preventDefault();
    setErrors({});
    create.mutate(
      {
        storyId,
        title: form.title,
        description: form.description || undefined,
        priceTierId: form.priceTierId,
        aliases: story.characters.map((c) => ({ token: c.token, aliasName: aliases[c.token] ?? "" })),
      },
      {
        onSuccess: () => {
          toast.success("Đã gửi truyện cho Moderator duyệt");
          queryClient.invalidateQueries({ queryKey: ["selling"] });
          navigate(ROUTES.PARENT.SELLING);
        },
        onError: (err) => {
          setErrors(Object.fromEntries(err.errors.map((x) => [x.path, x.message])));
          toast.error(err.message);
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link to={ROUTES.PARENT.studioStory(storyId)} className="inline-flex items-center gap-1 text-sm font-semibold text-navy/60 hover:text-primary">
        <ArrowLeft size={16} /> Về truyện
      </Link>
      <div>
        <h1 className="text-3xl">Đăng bán truyện</h1>
        <p className="mt-1 flex items-start gap-2 text-sm text-navy/65">
          <ShieldCheck size={18} className="shrink-0 text-secondary" /> Bản đăng bán dùng tên chung thay tên thật, không kèm chuyện thật ở nhà và không kèm giọng đọc của gia đình.
        </p>
      </div>

      <form onSubmit={submit} className="card space-y-4 p-6">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Tên truyện trên Chợ (không dùng tên thật)</span>
          <input required minLength={3} maxLength={200} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="VD: Bé và cơn giận" className={field} aria-invalid={!!errors["listing.title"]} />
          {errors["listing.title"] && <span className="mt-1 block text-sm text-danger">{errors["listing.title"]}</span>}
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Mô tả (không bắt buộc)</span>
          <textarea rows={3} maxLength={2000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Giá</span>
          <select required value={form.priceTierId} onChange={(e) => setForm({ ...form, priceTierId: e.target.value })} className={field}>
            <option value="">— Chọn giá —</option>
            {tiers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="space-y-2">
          <legend className="mb-1 text-sm font-semibold">Tên chung cho nhân vật</legend>
          {story.characters.map((c) => {
            const err = errors[`aliases.${c.token}`];
            return (
              <label key={c.token} className="flex flex-wrap items-center gap-3">
                <span className="w-32 text-sm text-navy/70">
                  {c.name} {c.isMain && "(chính)"} →
                </span>
                <input
                  required
                  maxLength={100}
                  value={aliases[c.token] ?? ""}
                  onChange={(e) => setAliases({ ...aliases, [c.token]: e.target.value })}
                  placeholder="VD: Bống"
                  aria-label={`Tên chung cho ${c.name}`}
                  aria-invalid={!!err}
                  className={`${field} min-w-40 flex-1`}
                />
                {err && <span className="w-full text-sm text-danger">{err}</span>}
              </label>
            );
          })}
        </fieldset>
        {Object.entries(errors)
          .filter(([path]) => path.startsWith("pages.") || path.startsWith("checkpoints."))
          .map(([path, msg]) => (
            <p key={path} className="text-sm text-danger">
              {msg}
            </p>
          ))}
        <button type="submit" disabled={create.isPending} className="btn-primary">
          {create.isPending && <Loader2 size={16} className="animate-spin" />} Gửi Moderator duyệt
        </button>
      </form>
    </div>
  );
}

export default NewListingPage;
