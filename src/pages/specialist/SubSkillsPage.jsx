import { useMemo, useState } from "react";
import { Loader2, Pencil, Search, SearchX, Sprout } from "lucide-react";
import Modal from "../../components/common/Modal";
import Switch from "../../components/common/Switch";
import CaselTag from "../../components/parent/library/CaselTag";
import useDebounce from "../../hooks/useDebounce";
import { useSubSkills, useUpdateSubSkill } from "../../hooks/usePedagogy";
import { useEqSkills } from "../../hooks/useTopics";
import { toast } from "../../stores/toastStore";
import { Select } from "../../components/ui";

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
  if (form.descriptionVi.trim().length < 10) return "Mô tả có ít nhất 10 ký tự";
  if (!Number.isInteger(form.ageMin) || !Number.isInteger(form.ageMax) || form.ageMin < 1 || form.ageMax > 18) return "Độ tuổi là số nguyên trong khoảng 1–18";
  if (form.ageMin > form.ageMax) return "Tuổi tối thiểu phải nhỏ hơn hoặc bằng tuổi tối đa";
  return "";
};

// Danh mục chuẩn CASEL: năng lực, mã và câu gốc tiếng Anh giữ nguyên; chỉ chỉnh diễn giải tiếng Việt và độ tuổi.
function SubSkillFormModal({ subSkill, onClose }) {
  const [form, setForm] = useState(() => ({
    nameVi: subSkill.nameVi,
    descriptionVi: subSkill.descriptionVi,
    ageMin: subSkill.ageMin,
    ageMax: subSkill.ageMax,
  }));
  const [error, setError] = useState("");
  const update = useUpdateSubSkill();

  const set = (key, numeric) => (e) => {
    setForm((f) => ({ ...f, [key]: numeric ? Number(e.target.value) : e.target.value }));
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    const message = validate(form);
    if (message) return setError(message);
    update.mutate(
      { id: subSkill.id, ...form, nameVi: form.nameVi.trim(), descriptionVi: form.descriptionVi.trim() },
      {
        onSuccess: () => {
          toast.success("Đã cập nhật kỹ năng con");
          onClose();
        },
        onError: (err) => setError(err.message),
      },
    );
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Điều chỉnh kỹ năng con"
      description="Kỹ năng con là một mục của khung CASEL nên năng lực và câu gốc tiếng Anh giữ nguyên. Bạn chỉnh cách diễn giải tiếng Việt cho phụ huynh và độ tuổi phù hợp."
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Hủy
          </button>
          <button type="submit" form="sub-skill-form" disabled={update.isPending} className="btn-primary py-2.5 text-sm disabled:opacity-70">
            {update.isPending && <Loader2 size={16} className="animate-spin" />} Lưu thay đổi
          </button>
        </>
      }
    >
      <form id="sub-skill-form" onSubmit={submit} noValidate className="space-y-4">
        <div className="space-y-3 rounded-2xl bg-surface px-4 py-3 text-sm">
          <p>
            <span className="block text-xs font-semibold text-navy/60">Năng lực CASEL</span>
            <span className="font-semibold">{subSkill.skill?.nameVi}</span>
          </p>
          {subSkill.caselTextEn && (
            <p>
              <span className="block text-xs font-semibold text-navy/60">Câu gốc CASEL (tiếng Anh)</span>
              <span className="italic text-navy/80">{subSkill.caselTextEn}</span>
            </p>
          )}
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Tên kỹ năng con (tiếng Việt)</span>
          <input value={form.nameVi} onChange={set("nameVi")} maxLength={200} placeholder="VD: Gọi tên cảm xúc của mình" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Mô tả cho phụ huynh</span>
          <textarea
            value={form.descriptionVi}
            onChange={set("descriptionVi")}
            rows={3}
            placeholder="Bé học được điều gì ở kỹ năng này, biểu hiện khi bé làm được..."
            className={`${inputClass} resize-none`}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Tuổi từ</span>
            <input type="number" min={1} max={18} value={form.ageMin} onChange={set("ageMin", true)} className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Đến</span>
            <input type="number" min={1} max={18} value={form.ageMax} onChange={set("ageMax", true)} className={inputClass} />
          </label>
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
  const [editing, setEditing] = useState(null);
  const debouncedSearch = useDebounce(search);

  const { data: skills = [] } = useEqSkills();
  const { data: rows = [], isLoading, isFetching, isError, refetch } = useSubSkills({ search: debouncedSearch, skillId, isActive });
  // Đang dùng lên trước, giữ thứ tự của API trong từng nhóm
  const subSkills = useMemo(() => [...rows].sort((a, b) => Number(b.isActive) - Number(a.isActive)), [rows]);
  const update = useUpdateSubSkill();

  const toggleActive = (s) => update.mutate({ id: s.id, isActive: !s.isActive }, { onError: (err) => toast.error(err.message) });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
            <Sprout size={16} /> Chương trình sư phạm
          </p>
          <h1 className="text-3xl">Kỹ năng con</h1>
          <p className="mt-1 max-w-2xl text-navy/70">
            Danh mục chuẩn gồm 40 mục của khung CASEL, chia theo 5 năng lực. Bạn bật những mục phù hợp với trẻ, chỉnh cách diễn giải tiếng Việt và độ tuổi. Chuyện mẫu chọn 1–3 kỹ năng con; mỗi kỹ năng con có các mẫu câu hỏi riêng.
          </p>
        </div>
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
        <div className="lg:w-64">
          <Select label="Năng lực" value={skillId} onChange={setSkillId} shape="pill" options={[{ value: "all", label: "Mọi năng lực" }, ...skills.map((s) => ({ value: s.id, label: s.nameVi }))]} />
        </div>
        <div className="lg:w-48">
          <Select label="Trạng thái" value={isActive} onChange={setIsActive} shape="pill" options={STATUS_OPTIONS} />
        </div>
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
                  {s.caselTextEn && <p className="mt-1 text-xs italic text-navy/55">{s.caselTextEn}</p>}
                  <p className="mt-1 text-xs text-navy/50">
                    {s.ageMin}–{s.ageMax} tuổi · {s.publishedTemplatesCount}/{s.templatesCount} mẫu đã ban hành · {s.topicsCount} chuyện mẫu · {s.checkpointsCount} điểm dừng
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Switch
                    checked={s.isActive}
                    onChange={() => toggleActive(s)}
                    disabled={update.isPending && update.variables?.id === s.id}
                    label={s.isActive ? "Tắt kỹ năng con" : "Bật lại kỹ năng con"}
                  />
                  <button onClick={() => setEditing(s)} className="rounded-full p-2 text-navy/60 hover:bg-surface hover:text-navy" aria-label="Điều chỉnh kỹ năng con">
                    <Pencil size={17} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editing && <SubSkillFormModal subSkill={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

export default SubSkillsPage;
