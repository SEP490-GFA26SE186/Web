import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { ROUTES } from "../../../constants/routes";
import { useStory } from "../../../hooks/useStudio";
import Switch from "../../../components/common/Switch";
import { createListing } from "../../../services/sellingService";
import { toast } from "../../../stores/toastStore";

const field = "w-full rounded-card border-2 border-outline px-4 py-2.5 focus:border-primary focus:outline-none";

// Giá do người bán tự đặt: 0 (miễn phí) hoặc 5.000–500.000đ, bội số 1.000
const PRICE_MIN = 5000;
const PRICE_MAX = 500000;
const PRICE_STEP = 1000;
const priceError = (v) => {
  if (v === "" || !Number.isInteger(v)) return "Nhập giá bằng số (đồng).";
  if (v < PRICE_MIN || v > PRICE_MAX) return "Giá từ 5.000đ đến 500.000đ, hoặc chọn Miễn phí.";
  if (v % PRICE_STEP !== 0) return "Giá phải là bội số của 1.000đ.";
  return null;
};

// Đăng bán một truyện riêng đã hoàn tất: tên mới, mô tả, giá, tên chung cho từng nhân vật.
// BE tạo bản sao đã gỡ cá nhân hoá (không chuyện thật, không giọng đọc) và gửi chuyên gia duyệt.
function NewListingPage() {
  const [params] = useSearchParams();
  const storyId = params.get("storyId");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: story, isLoading } = useStory(storyId);
  const [form, setForm] = useState({ title: "", description: "", free: false, price: "" });
  const [aliases, setAliases] = useState({});
  const [errors, setErrors] = useState({});
  const create = useMutation({ mutationFn: createListing });

  if (isLoading) return <Loader2 size={32} className="animate-spin text-primary" />;
  if (!story) return <p className="card p-6">Không tìm thấy truyện.</p>;

  const submit = (e) => {
    e.preventDefault();
    const priceVnd = form.free ? 0 : form.price === "" ? "" : Number(form.price);
    const priceMsg = form.free ? null : priceError(priceVnd);
    if (priceMsg) {
      setErrors({ "listing.priceVnd": priceMsg });
      return;
    }
    setErrors({});
    create.mutate(
      {
        storyId,
        title: form.title,
        description: form.description || undefined,
        priceVnd,
        aliases: story.characters.map((c) => ({ token: c.token, aliasName: aliases[c.token] ?? "" })),
      },
      {
        onSuccess: () => {
          toast.success("Đã gửi truyện cho chuyên gia duyệt");
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

  const priceErr = errors["listing.priceVnd"] ?? errors.priceVnd;

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
          <input required minLength={3} maxLength={200} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nhập tên truyện khi đăng bán" className={field} aria-invalid={!!errors["listing.title"]} />
          {errors["listing.title"] && <span className="mt-1 block text-sm text-danger">{errors["listing.title"]}</span>}
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Mô tả (không bắt buộc)</span>
          <textarea rows={3} maxLength={2000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={field} />
        </label>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="listing-price" className="text-sm font-semibold">
              Giá (đồng)
            </label>
            <span className="flex items-center gap-2 text-sm font-semibold">
              Miễn phí <Switch checked={form.free} onChange={(free) => setForm({ ...form, free })} label="Miễn phí" />
            </span>
          </div>
          {!form.free && (
            <input
              id="listing-price"
              type="number"
              inputMode="numeric"
              required
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Nhập giá bán (đồng)"
              aria-invalid={!!priceErr}
              aria-describedby="listing-price-help"
              className={field}
            />
          )}
          <p id="listing-price-help" className="text-xs text-navy/60">
            {form.free ? "Truyện miễn phí: phụ huynh nhận ngay, không qua thanh toán." : "Từ 5.000đ đến 500.000đ, bội số 1.000đ."} Chuyên gia sẽ xem cả giá khi duyệt.
          </p>
          {priceErr && <span className="block text-sm text-danger">{priceErr}</span>}
        </div>
        <fieldset className="space-y-2">
          <legend className="mb-1 text-sm font-semibold">Tên chung cho nhân vật</legend>
          <p className="mb-2 text-xs text-navy/60">{story.useTts ? "Truyện có giọng đọc: hệ thống đọc lại bằng tên chung này (vài phút) trước khi chuyên gia duyệt." : "Truyện đang tắt giọng đọc: bản đăng bán chỉ có chữ, người mua sẽ thấy nhãn \"Chỉ có chữ\"."}</p>
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
                  placeholder="Nhập tên thay thế"
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
          {create.isPending && <Loader2 size={16} className="animate-spin" />} Gửi chuyên gia duyệt
        </button>
      </form>
    </div>
  );
}

export default NewListingPage;
