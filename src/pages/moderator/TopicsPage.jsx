import { useState } from "react";
import { BookMarked, Loader2, Pencil, Plus, Search, SearchX, Trash2 } from "lucide-react";
import Modal from "../../components/common/Modal";
import Switch from "../../components/common/Switch";
import CaselTag from "../../components/parent/library/CaselTag";
import useDebounce from "../../hooks/useDebounce";
import { useCreateTopic, useDeleteTopic, useEqSkills, useTopics, useUpdateTopic } from "../../hooks/useTopics";
import { toast } from "../../stores/toastStore";

const inputClass =
  "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-2.5 text-sm outline-none transition focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";

const STATUS_OPTIONS = [
  { value: "all", label: "Mọi trạng thái" },
  { value: "true", label: "Đang dùng" },
  { value: "false", label: "Ngưng dùng" },
];

// Khớp topics.validation.js của BE
const validateTopic = (form) => {
  if (form.title.trim().length < 3 || form.title.trim().length > 200) return "Tên bài học dài 3–200 ký tự";
  if (!form.skillId) return "Chọn năng lực CASEL cho bài học";
  if (form.guidance.trim().length < 10) return "Hướng dẫn sư phạm có ít nhất 10 ký tự";
  if (!Number.isInteger(form.ageMin) || !Number.isInteger(form.ageMax)) return "Độ tuổi phải là số nguyên";
  if (form.ageMin < 1 || form.ageMax > 18) return "Độ tuổi trong khoảng 1–18";
  if (form.ageMin > form.ageMax) return "Tuổi tối thiểu phải nhỏ hơn hoặc bằng tuổi tối đa";
  return "";
};

function TopicFormModal({ topic, skills, onClose }) {
  const [form, setForm] = useState(() => ({
    title: topic?.title ?? "",
    skillId: topic?.skillId ?? "",
    guidance: topic?.guidance ?? "",
    ageMin: topic?.ageMin ?? 5,
    ageMax: topic?.ageMax ?? 8,
    displayOrder: topic?.displayOrder ?? 0,
    isActive: topic?.isActive ?? true,
  }));
  const [error, setError] = useState("");
  const create = useCreateTopic();
  const update = useUpdateTopic();
  const pending = create.isPending || update.isPending;

  const set = (key, numeric) => (e) => {
    setForm((f) => ({ ...f, [key]: numeric ? Number(e.target.value) : e.target.value }));
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    const message = validateTopic(form);
    if (message) return setError(message);
    const payload = { ...form, title: form.title.trim(), guidance: form.guidance.trim() };
    const options = {
      onSuccess: () => {
        toast.success(topic ? "Đã cập nhật bài học" : "Đã tạo bài học mới");
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
      title={topic ? "Sửa bài học" : "Thêm bài học"}
      description="Phụ huynh chọn bài học khi tạo truyện; điểm EQ của bé tính theo năng lực gắn với bài học."
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Hủy
          </button>
          <button type="submit" form="topic-form" disabled={pending} className="btn-primary py-2.5 text-sm disabled:opacity-70">
            {pending && <Loader2 size={16} className="animate-spin" />} {topic ? "Lưu thay đổi" : "Tạo bài học"}
          </button>
        </>
      }
    >
      <form id="topic-form" onSubmit={submit} noValidate className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Tên bài học</span>
          <input value={form.title} onChange={set("title")} maxLength={200} placeholder="VD: Con hay nổi giận" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Năng lực CASEL</span>
          <select value={form.skillId} onChange={set("skillId")} className={`${inputClass} cursor-pointer`}>
            <option value="">— Chọn năng lực —</option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nameVi}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Hướng dẫn sư phạm</span>
          <textarea
            value={form.guidance}
            onChange={set("guidance")}
            rows={4}
            placeholder="Mục tiêu bài học, tình huống gợi ý, điều cần tránh khi viết truyện..."
            className={`${inputClass} resize-none`}
          />
          <span className="mt-1 block text-xs text-navy/50">AI dùng hướng dẫn này khi viết truyện theo bài học</span>
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
          <span className="text-sm font-semibold">Cho phụ huynh chọn bài học này</span>
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
        toast.info(message); // BE: xóa hẳn, hoặc chuyển ngưng dùng nếu đã có truyện
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
          <h1 className="text-3xl">Danh sách bài học</h1>
          <p className="mt-1 max-w-2xl text-navy/70">
            Mỗi bài học gắn đúng một năng lực CASEL. Phụ huynh chọn bài học khi tạo truyện cho con.
          </p>
        </div>
        <button onClick={() => setEditing("new")} disabled={!skills.length} className="btn-primary self-start disabled:opacity-60 md:self-auto">
          <Plus size={20} /> Thêm bài học
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-card bg-white p-4 shadow-low lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-navy/40" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên bài học hoặc hướng dẫn..."
            className={`${inputClass} rounded-full pl-11`}
          />
        </label>
        <select value={skillId} onChange={(e) => setSkillId(e.target.value)} className={`${inputClass} cursor-pointer rounded-full lg:w-64`}>
          <option value="all">Mọi năng lực</option>
          {skills.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nameVi} ({s.activeTopicsCount})
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
          <h2 className="text-lg">Bài học</h2>
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
            <p className="font-display font-bold">Không tải được danh sách bài học</p>
            <button onClick={() => refetch()} className="btn-primary mt-4">
              Thử lại
            </button>
          </div>
        ) : topics.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <SearchX size={36} className="text-primary" />
            <p className="font-display font-bold">Chưa có bài học phù hợp</p>
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
                    label={t.isActive ? "Ngưng dùng bài học" : "Dùng lại bài học"}
                  />
                  <button onClick={() => setEditing(t)} className="rounded-full p-2 text-navy/60 hover:bg-surface hover:text-navy" aria-label="Sửa bài học">
                    <Pencil size={17} />
                  </button>
                  <button onClick={() => setDeleting(t)} className="rounded-full p-2 text-navy/60 hover:bg-danger-tint hover:text-danger" aria-label="Xóa bài học">
                    <Trash2 size={17} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editing && <TopicFormModal topic={editing === "new" ? null : editing} skills={skills} onClose={() => setEditing(null)} />}

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title={`Xóa bài học "${deleting?.title ?? ""}"?`}
        description={
          deleting?.storiesCount
            ? `Bài học đã có ${deleting.storiesCount} truyện dùng nên sẽ chỉ chuyển sang ngưng dùng, truyện cũ không bị ảnh hưởng.`
            : "Bài học chưa có truyện nào dùng, sẽ bị xóa hẳn."
        }
        size="max-w-md"
        footer={
          <>
            <button onClick={() => setDeleting(null)} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
              Hủy
            </button>
            <button
              onClick={confirmDelete}
              disabled={remove.isPending}
              className="inline-flex items-center gap-1.5 rounded-full bg-danger px-5 py-2.5 text-sm font-bold text-white transition hover:bg-danger-dark disabled:opacity-70"
            >
              {remove.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              {deleting?.storiesCount ? "Ngưng dùng" : "Xóa bài học"}
            </button>
          </>
        }
      />
    </div>
  );
}

export default TopicsPage;
