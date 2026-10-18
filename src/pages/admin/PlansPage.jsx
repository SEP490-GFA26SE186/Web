import { useState } from "react";
import { Loader2, Pencil, Plus } from "lucide-react";
import Modal from "../../components/common/Modal";
import Switch from "../../components/common/Switch";
import SettingsGroup from "../../components/admin/SettingsGroup";
import { LoadState, PageHeader } from "../../components/admin/AdminUi";
import { fieldClass, money } from "../../components/admin/adminFormat";
import { useAdminPlans, useCreatePlan, useCreatePriceTier, usePriceTiers, useUpdatePlan, useUpdatePriceTier } from "../../hooks/useAdmin";
import { toast } from "../../stores/toastStore";

const NUMBER_FIELDS = [
  ["priceVnd", "Giá (đ)"],
  ["creditsPerMonth", "Credit mỗi tháng"],
  ["maxChildren", "Số bé tối đa"],
  ["maxCharacters", "Số nhân vật tối đa"],
];

function PlanModal({ plan, onClose }) {
  const isNew = !plan;
  const [form, setForm] = useState(
    plan ?? { code: "", name: "", durationMonths: 1, priceVnd: 0, creditsPerMonth: 10, maxChildren: 1, maxCharacters: 5, canSell: false, isActive: true },
  );
  const create = useCreatePlan();
  const update = useUpdatePlan();
  const pending = create.isPending || update.isPending;
  const set = (k, numeric) => (e) => setForm((f) => ({ ...f, [k]: numeric ? Number(e.target.value) : e.target.value }));
  const isFree = plan?.code === "FREE";

  const submit = (e) => {
    e.preventDefault();
    const body = { name: form.name, priceVnd: form.priceVnd, creditsPerMonth: form.creditsPerMonth, maxChildren: form.maxChildren, maxCharacters: form.maxCharacters, canSell: form.canSell, isActive: form.isActive };
    const opts = { onSuccess: () => { toast.success(isNew ? "Đã tạo gói" : "Đã lưu gói"); onClose(); }, onError: (err) => toast.error(err.message) };
    if (isNew) create.mutate({ ...body, code: form.code, durationMonths: form.durationMonths }, opts);
    else update.mutate({ id: plan.id, ...body }, opts);
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Thêm gói" : `Sửa gói ${plan.name}`}
      description="Giá và credit mới áp dụng cho lần mua sau; đơn cũ giữ nguyên giá đã trả, kỳ đang chạy nhận credit theo gói mới từ tháng kế tiếp."
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">Hủy</button>
          <button type="submit" form="plan-form" disabled={pending} className="btn-primary py-2.5 text-sm">
            {pending && <Loader2 size={16} className="animate-spin" />} Lưu
          </button>
        </>
      }
    >
      <form id="plan-form" onSubmit={submit} className="space-y-3">
        {isNew && (
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Mã gói</span>
              <input required value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))} placeholder="FAMILY_QUARTER" className={fieldClass} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Thời hạn</span>
              <select value={form.durationMonths} onChange={set("durationMonths", true)} className={fieldClass}>
                <option value={1}>1 tháng</option>
                <option value={12}>12 tháng</option>
              </select>
            </label>
          </div>
        )}
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Tên gói</span>
          <input required minLength={2} value={form.name} onChange={set("name")} className={fieldClass} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          {NUMBER_FIELDS.map(([k, label]) => (
            <label key={k} className="block">
              <span className="mb-1 block text-sm font-semibold">{label}</span>
              <input type="number" min={k === "priceVnd" || k === "creditsPerMonth" ? 0 : 1} value={form[k]} onChange={set(k, true)} disabled={isFree && k === "priceVnd"} className={`${fieldClass} disabled:bg-surface`} />
            </label>
          ))}
        </div>
        <div className="flex flex-wrap gap-6 rounded-2xl bg-surface px-4 py-3 text-sm font-semibold">
          <span className="flex items-center gap-2">Được bán truyện <Switch checked={form.canSell} onChange={(canSell) => setForm((f) => ({ ...f, canSell }))} label="Được bán truyện" /></span>
          <span className="flex items-center gap-2">Đang mở bán <Switch checked={form.isActive} disabled={isFree} onChange={(isActive) => setForm((f) => ({ ...f, isActive }))} label="Đang mở bán" /></span>
        </div>
      </form>
    </Modal>
  );
}

function TiersSection() {
  const { data: tiers = [], isLoading, error } = usePriceTiers();
  const create = useCreatePriceTier();
  const update = useUpdatePriceTier();
  const [form, setForm] = useState({ label: "", priceVnd: "" });
  const add = (e) => {
    e.preventDefault();
    create.mutate(
      { label: form.label, priceVnd: Number(form.priceVnd) },
      { onSuccess: () => { toast.success("Đã thêm bậc giá"); setForm({ label: "", priceVnd: "" }); }, onError: (err) => toast.error(err.message) },
    );
  };
  return (
    <section className="card space-y-3 p-5">
      <div>
        <h2 className="text-lg">Bậc giá truyện</h2>
        <p className="text-sm text-navy/60">Người bán chọn một bậc khi đăng bán. Bậc đã có truyện dùng thì không đổi số tiền — tạo bậc mới và tắt bậc cũ.</p>
      </div>
      <LoadState isLoading={isLoading} error={error} />
      <ul className="divide-y divide-outline">
        {tiers.map((t) => (
          <li key={t.id} className="flex items-center gap-3 py-2.5 text-sm">
            <span className="w-28 font-bold">{money(t.priceVnd)}</span>
            <span className="flex-1">{t.label}</span>
            <span className="text-navy/60">{t.listingsCount} truyện</span>
            <Switch
              checked={t.isActive}
              disabled={update.isPending && update.variables?.id === t.id}
              onChange={() => update.mutate({ id: t.id, isActive: !t.isActive }, { onError: (e) => toast.error(e.message) })}
              label={t.isActive ? "Tắt bậc giá" : "Bật bậc giá"}
            />
          </li>
        ))}
      </ul>
      <form onSubmit={add} className="flex flex-wrap gap-2">
        <input required value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="Nhãn, VD: Truyện dài" aria-label="Nhãn bậc giá" className={`${fieldClass} min-w-48 flex-1 rounded-full`} />
        <input required type="number" min={0} step={1000} value={form.priceVnd} onChange={(e) => setForm((f) => ({ ...f, priceVnd: e.target.value }))} placeholder="Giá (đ)" aria-label="Giá bậc" className={`${fieldClass} w-36 rounded-full`} />
        <button type="submit" disabled={create.isPending} className="btn-primary px-4 py-2 text-sm">
          {create.isPending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Thêm bậc
        </button>
      </form>
    </section>
  );
}

// Gói & định giá: gói (giá, credit, giới hạn), bậc giá truyện, cấu hình chợ truyện + giám sát.
function PlansPage() {
  const { data: plans = [], isLoading, error } = useAdminPlans();
  const [editing, setEditing] = useState(null); // null | "new" | plan

  return (
    <div className="space-y-6">
      <PageHeader title="Gói & định giá" description="Gói cấp credit mỗi tháng (không bán credit lẻ). Thay đổi chỉ áp dụng cho giao dịch mới.">
        <button type="button" onClick={() => setEditing("new")} className="btn-primary">
          <Plus size={18} /> Thêm gói
        </button>
      </PageHeader>

      <section className="card overflow-x-auto">
        <LoadState isLoading={isLoading} error={error} empty={!plans.length} />
        {plans.length > 0 && (
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-outline text-left text-xs text-navy/60">
              <tr><th className="px-5 py-3">Gói</th><th>Giá</th><th>Credit / tháng</th><th>Bé / nhân vật</th><th>Bán truyện</th><th>Đang dùng</th><th className="pr-5" /></tr>
            </thead>
            <tbody className="divide-y divide-outline">
              {plans.map((p) => (
                <tr key={p.id} className={p.isActive ? "" : "text-navy/45"}>
                  <td className="px-5 py-3">
                    <p className="font-bold">{p.name} {!p.isActive && <span className="ml-1 rounded-full bg-outline px-2 py-0.5 text-xs">Đã tắt</span>}</p>
                    <p className="text-xs text-navy/55">{p.code} • {p.durationMonths === 12 ? "gói năm" : "gói tháng"}</p>
                  </td>
                  <td>{money(p.priceVnd)}</td>
                  <td>{p.creditsPerMonth}</td>
                  <td>{p.maxChildren} / {p.maxCharacters}</td>
                  <td>{p.canSell ? "Có" : "—"}</td>
                  <td>{p.activeSubscribers}</td>
                  <td className="pr-5 text-right">
                    <button type="button" onClick={() => setEditing(p)} className="rounded-full p-2 text-navy/60 hover:bg-surface" aria-label={`Sửa gói ${p.name}`}>
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <TiersSection />
        <section className="card space-y-3 p-5">
          <h2 className="text-lg">Chợ truyện & hoàn tiền</h2>
          <SettingsGroup group="market" />
        </section>
      </div>
      <section className="card space-y-3 p-5">
        <h2 className="text-lg">Giám sát nội dung</h2>
        <SettingsGroup group="moderation" />
      </section>

      {editing && <PlanModal plan={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

export default PlansPage;
