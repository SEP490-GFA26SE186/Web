import { useState } from "react";
import { Loader2, Pencil, Plus, Search, SearchX, Sprout, Trash2 } from "lucide-react";
import Modal from "../../components/common/Modal";
import Switch from "../../components/common/Switch";
import CaselTag from "../../components/parent/library/CaselTag";
import useDebounce from "../../hooks/useDebounce";
import { useCaselReferences, useCreateSubSkill, useDeleteSubSkill, useSubSkills, useUpdateSubSkill } from "../../hooks/usePedagogy";
import { useEqSkills } from "../../hooks/useTopics";
import { toast } from "../../stores/toastStore";

const inputClass =
  "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-2.5 text-sm outline-none transition focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";

const STATUS_OPTIONS = [
  { value: "all", label: "Mọi trạng thái" },
  { value: "true", label: "Đang dùng" },
  { value: "false", label: "Đã tắt" },
];

// Khớp sub-skills.validation.js của BE
const validate = (form) => {
  if (form.nameVi.trim().length < 3 || form.nameVi.trim().length > 200) return "Tên kỹ năng con dài 3–200 ký tự";
  if (!form.skillId) return "Chọn năng lực CASEL";
  if (!form.caselReferenceId) return "Chọn mục CASEL mà kỹ năng con này bám theo";
  if (form.descriptionVi.trim().length < 10) return "Mô tả có ít nhất 10 ký tự";
  if (!Number.isInteger(form.ageMin) || !Number.isInteger(form.ageMax) || form.ageMin < 1 || form.ageMax > 18) return "Độ tuổi là số nguyên trong khoảng 1–18";
  if (form.ageMin > form.ageMax) return "Tuổi tối thiểu phải nhỏ hơn hoặc bằng tuổi tối đa";
  return "";
};

function SubSkillFormModal({ subSkill, skills, onClose }) {
  const [form, setForm] = useState(() => ({
    skillId: subSkill?.skillId ?? "",
    caselReferenceId: subSkill?.caselReference?.id ?? "",
    nameVi: subSkill?.nameVi ?? "",
    descriptionVi: subSkill?.descriptionVi ?? "",
    ageMin: subSkill?.ageMin ?? 5,
    ageMax: subSkill?.ageMax ?? 8,
    displayOrder: subSkill?.displayOrder ?? 0,
    isActive: subSkill?.isActive ?? true,
  }));
  const [error, setError] = useState("");
  const create = useCreateSubSkill();
  const update = useUpdateSubSkill();
  const pending = create.isPending || update.isPending;
  const { data: references = [], isLoading: loadingRefs } = useCaselReferences(form.skillId);
  const selectedRef = references.find((r) => r.id === form.caselReferenceId) ?? (form.skillId === subSkill?.skillId ? subSkill?.caselReference : null);

  const set = (key, numeric) => (e) => {
    setForm((f) => ({ ...f, [key]: numeric ? Number(e.target.value) : e.target.value }));
    setError("");
  };
  const setSkill = (e) => {
    setForm((f) => ({ ...f, skillId: e.target.value, caselReferenceId: "" })); // mục CASEL phải cùng năng lực
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    const message = validate(form);
    if (message) return setError(message);
    const payload = { ...form, nameVi: form.nameVi.trim(), descriptionVi: form.descriptionVi.trim() };
    const options = {
      onSuccess: () => {
        toast.success(subSkill ? "Đã cập nhật kỹ năng con" : "Đã tạo kỹ năng con mới");
        onClose();
      },
      onError: (err) => setError(err.message), // gồm 422: đã có điểm dừng dùng nên không đổi năng lực / mục CASEL
    };
    if (subSkill) update.mutate({ id: subSkill.id, ...payload }, options);
    else create.mutate(payload, options);
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={subSkill ? "Sửa kỹ năng con" : "Thêm kỹ năng con"}
      description="Kỹ năng con là phần nhỏ của một năng lực CASEL, bám theo đúng một mục trong khung CASEL."
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Hủy
          </button>
          <button type="submit" form="sub-skill-form" disabled={pending} className="btn-primary py-2.5 text-sm disabled:opacity-70">
            {pending && <Loader2 size={16} className="animate-spin" />} {subSkill ? "Lưu thay đổi" : "Tạo kỹ năng con"}
          </button>
        </>
      }
    >
      <form id="sub-skill-form" onSubmit={submit} noValidate className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Năng lực CASEL</span>
          <select value={form.skillId} onChange={setSkill} className={`${inputClass} cursor-pointer`}>
            <option value="">— Chọn năng lực —</option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nameVi}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Mục CASEL</span>
          <select
            value={form.caselReferenceId}
            onChange={set("caselReferenceId")}
            disabled={!form.skillId || loadingRefs}
            className={`${inputClass} cursor-pointer disabled:cursor-not-allowed disabled:bg-surface`}
          >
            <option value="">{form.skillId ? "— Chọn mục CASEL —" : "Chọn năng lực trước"}</option>
            {references.map((r) => (
              <option key={r.id} value={r.id}>
                {r.code}
              </option>
            ))}
          </select>
          {selectedRef && (
            <span className="mt-2 block rounded-2xl bg-secondary-tint px-4 py-2.5 text-sm text-navy/80">
              <span className="font-bold">{selectedRef.code}:</span> {selectedRef.textEn}
            </span>
          )}
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Tên kỹ năng con (tiếng Việt)</span>
          <input value={form.nameVi} onChange={set("nameVi")} maxLength={200} placeholder="VD: Gọi tên cảm xúc của mình" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Mô tả</span>
          <textarea
            value={form.descriptionVi}
            onChange={set("descriptionVi")}
            rows={3}
            placeholder="Bé học được điều gì ở kỹ năng này, biểu hiện khi bé làm được..."
            className={`${inputClass} resize-none`}
          />
        </label>
        <div className="grid grid-cols-3 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Tuổi từ</span>
            <input type="number" min={1} max={18} value={form.ageMin} onChange={set("ageMin", true)} className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Đến</span>
            <input type="number" min={1} max={18} value={form.ageMax} onChange={set("ageMax", true)} className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Thứ tự</span>
            <input type="number" value={form.displayOrder} onChange={set("displayOrder", true)} className={inputClass} />
          </label>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3">
          <span className="text-sm font-semibold">Đang dùng</span>
          <Switch checked={form.isActive} onChange={(isActive) => setForm((f) => ({ ...f, isActive }))} label="Đang dùng" />
        </div>
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      </form>
    </Modal>
  );
}

function SubSkillsPage() {
  const [search, setSearch] = useState("");
  const [skillId, setSkillId] = useState("all");
  const [isActive, setIsActive] = useState("all");
  const [editing, setEditing] = useState(null); // null | "new" | subSkill
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data: skills = [] } = useEqSkills();
  const { data: subSkills = [], isLoading, isFetching, isError, refetch } = useSubSkills({ search: debouncedSearch, skillId, isActive });
  const update = useUpdateSubSkill();
  const remove = useDeleteSubSkill();

  const toggleActive = (s) => update.mutate({ id: s.id, isActive: !s.isActive }, { onError: (err) => toast.error(err.message) });

  const closeDelete = () => {
    setDeleting(null);
    setDeleteError("");
  };
  const confirmDelete = () =>
    remove.mutate(deleting.id, {
      onSuccess: ({ message }) => {
        toast.success(message);
        closeDelete();
      },
      onError: (err) => setDeleteError(err.message), // 409: đã có mẫu / bài học / điểm dừng dùng, chỉ tắt được
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
            <Sprout size={16} /> Chương trình sư phạm
          </p>
          <h1 className="text-3xl">Kỹ năng con</h1>
          <p className="mt-1 max-w-2xl text-navy/70">
            Mỗi kỹ năng con thuộc một năng lực CASEL và bám theo một mục trong khung CASEL. Bài học chọn 1–3 kỹ năng con; mỗi kỹ năng con có các mẫu câu hỏi riêng.
          </p>
        </div>
        <button onClick={() => setEditing("new")} disabled={!skills.length} className="btn-primary shrink-0 self-start whitespace-nowrap disabled:opacity-60 md:self-auto">
          <Plus size={20} /> Thêm kỹ năng con
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-card bg-white p-4 shadow-low lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-navy/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên kỹ năng con..."
            className={`${inputClass} rounded-full pl-11`}
          />
        </label>
        <select value={skillId} onChange={(e) => setSkillId(e.target.value)} className={`${inputClass} cursor-pointer rounded-full lg:w-64`}>
          <option value="all">Mọi năng lực</option>
          {skills.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nameVi}
            </option>
          ))}
        </select>
        <select value={isActive} onChange={(e) => setIsActive(e.target.value)} className={`${inputClass} cursor-pointer rounded-full lg:w-48`}>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <section className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-outline px-5 py-3">
          <h2 className="text-lg">Kỹ năng con</h2>
          <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-navy/70">{subSkills.length}</span>
          {isFetching && !isLoading && <Loader2 size={16} className="animate-spin text-primary" />}
        </div>

        {isLoading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-surface" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <p className="font-display font-bold">Không tải được danh sách kỹ năng con</p>
            <button onClick={() => refetch()} className="btn-primary mt-4">
              Thử lại
            </button>
          </div>
        ) : subSkills.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <SearchX size={36} className="text-primary" />
            <p className="font-display font-bold">Chưa có kỹ năng con phù hợp</p>
          </div>
        ) : (
          <ul className={`divide-y divide-outline transition-opacity ${isFetching ? "opacity-60" : ""}`}>
            {subSkills.map((s) => (
              <li key={s.id} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-base ${s.isActive ? "" : "text-navy/50"}`}>{s.nameVi}</h3>
                    <CaselTag competency={s.skill?.caselCode} className="bg-secondary-tint" />
                    {!s.isActive && <span className="rounded-full bg-outline px-2 py-0.5 text-xs font-bold text-navy/60">Đã tắt</span>}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-navy/65">{s.descriptionVi}</p>
                  {s.caselReference && (
                    <p className="mt-1 text-xs text-navy/60">
                      <span className="font-bold">{s.caselReference.code}:</span> {s.caselReference.textEn}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-navy/50">
                    {s.ageMin}–{s.ageMax} tuổi · {s.publishedTemplatesCount}/{s.templatesCount} mẫu đã ban hành · {s.topicsCount} bài học · {s.checkpointsCount} điểm dừng
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Switch
                    checked={s.isActive}
                    onChange={() => toggleActive(s)}
                    disabled={update.isPending && update.variables?.id === s.id}
                    label={s.isActive ? "Tắt kỹ năng con" : "Bật lại kỹ năng con"}
                  />
                  <button onClick={() => setEditing(s)} className="rounded-full p-2 text-navy/60 hover:bg-surface hover:text-navy" aria-label="Sửa kỹ năng con">
                    <Pencil size={17} />
                  </button>
                  <button onClick={() => setDeleting(s)} className="rounded-full p-2 text-navy/60 hover:bg-danger-tint hover:text-danger" aria-label="Xóa kỹ năng con">
                    <Trash2 size={17} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editing && <SubSkillFormModal subSkill={editing === "new" ? null : editing} skills={skills} onClose={() => setEditing(null)} />}

      <Modal
        open={!!deleting}
        onClose={closeDelete}
        title={`Xóa kỹ năng con "${deleting?.nameVi ?? ""}"?`}
        description="Chỉ xóa hẳn được khi chưa có mẫu câu hỏi, bài học hay điểm dừng nào dùng. Nếu đã dùng, hãy tắt kỹ năng con."
        size="max-w-md"
        footer={
          <>
            <button onClick={closeDelete} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
              Hủy
            </button>
            <button
              onClick={confirmDelete}
              disabled={remove.isPending}
              className="inline-flex items-center gap-1.5 rounded-full bg-danger px-5 py-2.5 text-sm font-bold text-white transition hover:bg-danger-dark disabled:opacity-70"
            >
              {remove.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Xóa kỹ năng con
            </button>
          </>
        }
      >
        {deleteError && <p className="text-sm font-semibold text-red-600">{deleteError}</p>}
      </Modal>
    </div>
  );
}

export default SubSkillsPage;
