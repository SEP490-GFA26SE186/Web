import { useState } from "react";
import { BookMarked, Loader2, Pencil, Plus, Search, SearchX, Trash2 } from "lucide-react";
import Modal from "../../components/common/Modal";
import Switch from "../../components/common/Switch";
import CaselTag from "../../components/parent/library/CaselTag";
import useDebounce from "../../hooks/useDebounce";
import { useSubSkills } from "../../hooks/usePedagogy";
import { useCreateTopic, useDeleteTopic, useEqSkills, useTopics, useUpdateTopic } from "../../hooks/useTopics";
import { toast } from "../../stores/toastStore";
import { Select } from "../../components/ui";
import { ConfirmDialog } from "../../components/ui";

const inputClass =
  "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-2.5 text-sm outline-none transition focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";

const STATUS_OPTIONS = [
  { value: "all", label: "Mọi trạng thái" },
  { value: "true", label: "Đang dùng" },
  { value: "false", label: "Ngưng dùng" },
];

// Khớp topics.validation.js của BE
const validateTopic = (form) => {
  if (form.title.trim().length < 3 || form.title.trim().length > 200) return "Tên chuyện mẫu dài 3–200 ký tự";
  if (!form.skillId) return "Chọn năng lực CASEL cho chuyện mẫu";
  if (form.subSkillIds.length < 1 || form.subSkillIds.length > 3) return "Chọn từ 1 đến 3 kỹ năng con";
  if (form.guidance.trim().length < 10) return "Cốt truyện gợi ý có ít nhất 10 ký tự";
  if (!Number.isInteger(form.ageMin) || !Number.isInteger(form.ageMax)) return "Độ tuổi phải là số nguyên";
  if (form.ageMin < 1 || form.ageMax > 18) return "Độ tuổi trong khoảng 1–18";
  if (form.ageMin > form.ageMax) return "Tuổi tối thiểu phải nhỏ hơn hoặc bằng tuổi tối đa";
  return "";
};

function TopicFormModal({ topic, skills, onClose }) {
  const [form, setForm] = useState(() => ({
    title: topic?.title ?? "",
    skillId: topic?.skillId ?? "",
    subSkillIds: topic?.subSkills?.map((x) => x.id) ?? [],
    guidance: topic?.guidance ?? "",
    ageMin: topic?.ageMin ?? 5,
    ageMax: topic?.ageMax ?? 8,
    displayOrder: topic?.displayOrder ?? 0,
    isActive: topic?.isActive ?? true,
  }));
  const [error, setError] = useState("");
  const create = useCreateTopic();
  const update = useUpdateTopic();
  const { data: subSkills = [], isLoading: loadingSubs } = useSubSkills({ skillId: form.skillId, isActive: "true" }, { enabled: !!form.skillId });
  const pending = create.isPending || update.isPending;
  // BE khoá năng lực khi chuyện mẫu đã có truyện (điểm EQ của truyện cũ phải giữ nguyên nghĩa)
  const skillLocked = topic?.storiesCount > 0;

  const set = (key, numeric) => (e) => {
    setForm((f) => ({ ...f, [key]: numeric ? Number(e.target.value) : e.target.value }));
    setError("");
  };

  const setSkill = (e) => {
    setForm((f) => ({ ...f, skillId: e.target.value, subSkillIds: [] })); // kỹ năng con phải cùng năng lực
    setError("");
  };
  const toggleSub = (id) => {
    setForm((f) => ({ ...f, subSkillIds: f.subSkillIds.includes(id) ? f.subSkillIds.filter((x) => x !== id) : [...f.subSkillIds, id] }));
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    const message = validateTopic(form);
    if (message) return setError(message);
    const payload = { ...form, title: form.title.trim(), guidance: form.guidance.trim() };
    if (skillLocked) delete payload.skillId;
    // Sửa chuyện mẫu: chỉ gửi kỹ năng con khi đổi (BE kiểm lại 422 theo từng kỹ năng con)
    const original = topic?.subSkills?.map((x) => x.id) ?? [];
    const unchanged = original.length === form.subSkillIds.length && original.every((id) => form.subSkillIds.includes(id));
    if (topic && unchanged) delete payload.subSkillIds;
    const options = {
      onSuccess: () => {
        toast.success(topic ? "Đã cập nhật chuyện mẫu" : "Đã tạo chuyện mẫu mới");
        onClose();
      },
      onError: (err) => setError(err.message),
    };
    if (topic) update.mutate({ id: topic.id, ...payload }, options);
    else create.mutate(payload, options);
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={topic ? "Sửa chuyện mẫu" : "Thêm chuyện mẫu"}
      description="Phụ huynh chọn chuyện mẫu khi tạo truyện; điểm EQ của bé tính theo năng lực gắn với chuyện mẫu."
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Hủy
          </button>
          <button type="submit" form="topic-form" disabled={pending} className="btn-primary py-2.5 text-sm disabled:opacity-70">
            {pending && <Loader2 size={16} className="animate-spin" />} {topic ? "Lưu thay đổi" : "Tạo chuyện mẫu"}
          </button>
        </>
      }
    >
      <form id="topic-form" onSubmit={submit} noValidate className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Tên chuyện mẫu</span>
          <input value={form.title} onChange={set("title")} maxLength={200} placeholder="VD: Con hay nổi giận" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Năng lực CASEL</span>
          <Select
            value={form.skillId}
            onChange={(v) => setSkill({ target: { value: v } })}
            disabled={skillLocked}
            placeholder="Chọn năng lực"
            options={skills.map((s) => ({ value: s.id, label: s.nameVi }))}
          />
          {skillLocked && (
            <span className="mt-1 block text-xs text-navy/50">
              Đã có {topic.storiesCount} truyện dùng nên không đổi được năng lực. Cần năng lực khác thì tạo chuyện mẫu mới.
            </span>
          )}
        </label>
        <div>
          <span className="mb-1.5 block text-sm font-semibold">Kỹ năng con (chọn 1–3)</span>
          {!form.skillId ? (
            <p className="rounded-2xl bg-surface px-4 py-3 text-sm text-navy/60">Chọn năng lực CASEL trước để xem các kỹ năng con.</p>
          ) : loadingSubs ? (
            <div className="h-16 animate-pulse rounded-2xl bg-surface" />
          ) : subSkills.length === 0 ? (
            <p className="rounded-2xl bg-surface px-4 py-3 text-sm text-navy/60">Năng lực này chưa có kỹ năng con đang dùng. Hãy tạo ở trang Kỹ năng con.</p>
          ) : (
            <ul className="space-y-2">
              {subSkills.map((s) => {
                const checked = form.subSkillIds.includes(s.id);
                const noTemplate = s.publishedTemplatesCount === 0;
                const disabled = !checked && (noTemplate || form.subSkillIds.length >= 3);
                return (
                  <li key={s.id}>
                    <label
                      className={`flex items-start gap-3 rounded-2xl border-[1.5px] px-4 py-2.5 text-sm ${
                        checked ? "border-secondary bg-secondary-tint" : "border-outline"
                      } ${disabled ? "opacity-50" : "cursor-pointer"}`}
                    >
                      <input type="checkbox" className="mt-1" checked={checked} disabled={disabled} onChange={() => toggleSub(s.id)} />
                      <span className="min-w-0">
                        <span className="block font-semibold">{s.nameVi}</span>
                        <span className="block text-xs italic text-navy/60">{s.caselTextEn || "Kỹ năng do chuyên gia bổ sung"}</span>
                        {noTemplate && <span className="block text-xs font-semibold text-danger">Chưa có mẫu câu hỏi đã ban hành</span>}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Cốt truyện gợi ý</span>
          <textarea
            value={form.guidance}
            onChange={set("guidance")}
            rows={4}
            placeholder="Sự việc của chuyện mẫu: ai, ở đâu, chuyện gì xảy ra, điều cần tránh khi viết truyện..."
            className={`${inputClass} resize-none`}
          />
          <span className="mt-1 block text-xs text-navy/50">AI dựng truyện theo cốt truyện này; câu hỏi chấm điểm đi theo kỹ năng con đã chọn</span>
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
          <span className="text-sm font-semibold">Cho phụ huynh chọn chuyện mẫu này</span>
          <Switch checked={form.isActive} onChange={(isActive) => setForm((f) => ({ ...f, isActive }))} label="Đang dùng" />
        </div>
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      </form>
    </Modal>
  );
}

function TopicsPage() {
  const [search, setSearch] = useState("");
  const [skillId, setSkillId] = useState("all");
  const [isActive, setIsActive] = useState("all");
  const [editing, setEditing] = useState(null); // null | "new" | topic
  const [deleting, setDeleting] = useState(null);
  const debouncedSearch = useDebounce(search);

  const { data: skills = [] } = useEqSkills();
  const { data: topics = [], isLoading, isFetching, isError, refetch } = useTopics({ search: debouncedSearch, skillId, isActive });
  const update = useUpdateTopic();
  const remove = useDeleteTopic();

  const toggleActive = (topic) =>
    update.mutate(
      { id: topic.id, isActive: !topic.isActive },
      { onError: (err) => toast.error(err.message) },
    );

  const confirmDelete = () =>
    remove.mutate(deleting.id, {
      onSuccess: ({ message }) => {
        toast.success(message); // BE: xóa hẳn, hoặc chuyển ngưng dùng nếu đã có truyện
        setDeleting(null);
      },
      onError: (err) => toast.error(err.message),
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
            <BookMarked size={16} /> Thư viện nội dung
          </p>
          <h1 className="text-3xl">Danh sách chuyện mẫu</h1>
          <p className="mt-1 max-w-2xl text-navy/70">
            Mỗi chuyện mẫu gắn đúng một năng lực CASEL. Phụ huynh chọn chuyện mẫu khi tạo truyện cho con.
          </p>
        </div>
        <button onClick={() => setEditing("new")} disabled={!skills.length} className="btn-primary shrink-0 self-start whitespace-nowrap disabled:opacity-60 md:self-auto">
          <Plus size={20} /> Thêm chuyện mẫu
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-card bg-white p-4 shadow-low lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-navy/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên chuyện mẫu..."
            className={`${inputClass} rounded-full pl-11`}
          />
        </label>
        <div className="lg:w-64">
          <Select
            label="Năng lực"
            value={skillId}
            onChange={setSkillId}
            shape="pill"
            options={[{ value: "all", label: "Mọi năng lực" }, ...skills.map((s) => ({ value: s.id, label: s.nameVi, description: `${s.activeTopicsCount} chuyện mẫu đang dùng` }))]}
            renderValue={(o) => o.label}
          />
        </div>
        <div className="lg:w-48">
          <Select label="Trạng thái" value={isActive} onChange={setIsActive} shape="pill" options={STATUS_OPTIONS} />
        </div>
      </div>

      <section className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-outline px-5 py-3">
          <h2 className="text-lg">Chuyện mẫu</h2>
          <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-navy/70">{topics.length}</span>
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
            <p className="font-display font-bold">Không tải được danh sách chuyện mẫu</p>
            <button onClick={() => refetch()} className="btn-primary mt-4">
              Thử lại
            </button>
          </div>
        ) : topics.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <SearchX size={36} className="text-primary" />
            <p className="font-display font-bold">Chưa có chuyện mẫu phù hợp</p>
          </div>
        ) : (
          <ul className={`divide-y divide-outline transition-opacity ${isFetching ? "opacity-60" : ""}`}>
            {topics.map((t) => (
              <li key={t.id} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-base ${t.isActive ? "" : "text-navy/50"}`}>{t.title}</h3>
                    <CaselTag competency={t.skill?.caselCode} className="bg-secondary-tint" />
                    {!t.isActive && <span className="rounded-full bg-outline px-2 py-0.5 text-xs font-bold text-navy/60">Ngưng dùng</span>}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-navy/65">{t.guidance}</p>
                  {t.subSkills?.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {t.subSkills.map((s) => (
                        <span key={s.id} title={s.caselTextEn ?? undefined} className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-semibold text-navy/70">
                          {s.nameVi}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-1 text-xs text-navy/50">
                    {t.ageMin}–{t.ageMax} tuổi · {t.storiesCount} truyện · Thứ tự {t.displayOrder}
                    {t.creator && ` · Tạo bởi ${t.creator.fullName || t.creator.username}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Switch
                    checked={t.isActive}
                    onChange={() => toggleActive(t)}
                    disabled={update.isPending && update.variables?.id === t.id}
                    label={t.isActive ? "Ngưng dùng chuyện mẫu" : "Dùng lại chuyện mẫu"}
                  />
                  <button onClick={() => setEditing(t)} className="rounded-full p-2 text-navy/60 hover:bg-surface hover:text-navy" aria-label="Sửa chuyện mẫu">
                    <Pencil size={17} />
                  </button>
                  <button onClick={() => setDeleting(t)} className="rounded-full p-2 text-navy/60 hover:bg-danger-tint hover:text-danger" aria-label="Xóa chuyện mẫu">
                    <Trash2 size={17} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editing && <TopicFormModal topic={editing === "new" ? null : editing} skills={skills} onClose={() => setEditing(null)} />}

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={remove.isPending}
        tone={deleting?.storiesCount ? "warning" : "danger"}
        title={`${deleting?.storiesCount ? "Ngưng dùng" : "Xóa"} chuyện mẫu "${deleting?.title ?? ""}"?`}
        description={
          deleting?.storiesCount
            ? `Chuyện mẫu đã có ${deleting.storiesCount} truyện dùng nên sẽ chỉ chuyển sang ngưng dùng, truyện cũ không bị ảnh hưởng.`
            : "Chuyện mẫu chưa có truyện nào dùng, sẽ bị xóa hẳn."
        }
        confirmLabel={deleting?.storiesCount ? "Ngưng dùng" : "Xóa"}
      />
    </div>
  );
}

export default TopicsPage;
