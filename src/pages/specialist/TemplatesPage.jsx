import { useState } from "react";
import { FileQuestion, Loader2, PenLine, Plus, SearchX, Trash2 } from "lucide-react";
import Modal from "../../components/common/Modal";
import Switch from "../../components/common/Switch";
import TemplateVersionForm from "../../components/specialist/TemplateVersionForm";
import { ANSWER_FORMATS } from "../../constants/story";
import { useCreateTemplate, useDeleteTemplate, useSubSkills, useTemplates, useUpdateTemplate } from "../../hooks/usePedagogy";
import { toast } from "../../stores/toastStore";

const inputClass =
  "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-2.5 text-sm outline-none transition focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";

function CreateTemplateModal({ subSkills, defaultSubSkillId, onClose, onCreated }) {
  const [form, setForm] = useState({ subSkillId: defaultSubSkillId, title: "", answerFormat: "emotion_pick" });
  const [error, setError] = useState("");
  const create = useCreateTemplate();

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError("");
  };
  const submit = (e) => {
    e.preventDefault();
    if (!form.subSkillId) return setError("Chọn kỹ năng con cho mẫu câu hỏi");
    if (form.title.trim().length < 3) return setError("Tên mẫu tối thiểu 3 ký tự");
    create.mutate(
      { ...form, title: form.title.trim() },
      {
        onSuccess: (t) => {
          toast.success("Đã tạo mẫu câu hỏi, hãy soạn nội dung bản nháp");
          onCreated(t);
        },
        onError: (err) => setError(err.message),
      },
    );
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Thêm mẫu câu hỏi"
      description="Dạng trả lời không đổi được sau khi tạo. Nội dung soạn ở bước tiếp theo."
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Hủy
          </button>
          <button type="submit" form="template-form" disabled={create.isPending} className="btn-primary py-2.5 text-sm disabled:opacity-70">
            {create.isPending && <Loader2 size={16} className="animate-spin" />} Tạo mẫu
          </button>
        </>
      }
    >
      <form id="template-form" onSubmit={submit} noValidate className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Kỹ năng con</span>
          <select value={form.subSkillId} onChange={set("subSkillId")} className={`${inputClass} cursor-pointer`}>
            <option value="">— Chọn kỹ năng con —</option>
            {subSkills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nameVi}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Tên mẫu</span>
          <input value={form.title} onChange={set("title")} maxLength={200} placeholder="VD: Gọi tên cảm xúc sau khi bị giành đồ chơi" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Dạng trả lời</span>
          <select value={form.answerFormat} onChange={set("answerFormat")} className={`${inputClass} cursor-pointer`}>
            {Object.entries(ANSWER_FORMATS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      </form>
    </Modal>
  );
}

function TemplatesPage() {
  const [subSkillId, setSubSkillId] = useState("all");
  const [creating, setCreating] = useState(false);
  const [composing, setComposing] = useState(null); // id mẫu đang soạn (lấy bản mới nhất từ danh sách)
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const { data: subSkills = [] } = useSubSkills({});
  const { data: templates = [], isLoading, isFetching, isError, refetch } = useTemplates({ subSkillId });
  const update = useUpdateTemplate();
  const remove = useDeleteTemplate();
  const composingTemplate = templates.find((t) => t.id === composing);

  const toggleActive = (t) => update.mutate({ id: t.id, isActive: !t.isActive }, { onError: (err) => toast.error(err.message) });

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
      onError: (err) => setDeleteError(err.message), // 409: đã có điểm dừng dùng, chỉ tắt được
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
            <FileQuestion size={16} /> Chương trình sư phạm
          </p>
          <h1 className="text-3xl">Mẫu câu hỏi</h1>
          <p className="mt-1 max-w-2xl text-navy/70">
            Mẫu câu hỏi gắn với một kỹ năng con và có phiên bản. Bản đã ban hành không bị sửa; muốn đổi thì soạn bản nháp mới rồi ban hành.
          </p>
        </div>
        <button onClick={() => setCreating(true)} disabled={!subSkills.length} className="btn-primary shrink-0 self-start whitespace-nowrap disabled:opacity-60 md:self-auto">
          <Plus size={20} /> Thêm mẫu câu hỏi
        </button>
      </div>

      <div className="rounded-card bg-white p-4 shadow-low">
        <select value={subSkillId} onChange={(e) => setSubSkillId(e.target.value)} className={`${inputClass} cursor-pointer rounded-full lg:w-96`} aria-label="Lọc theo kỹ năng con">
          <option value="all">Mọi kỹ năng con</option>
          {subSkills.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nameVi}
            </option>
          ))}
        </select>
      </div>

      <section className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-outline px-5 py-3">
          <h2 className="text-lg">Mẫu câu hỏi</h2>
          <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-navy/70">{templates.length}</span>
          {isFetching && !isLoading && <Loader2 size={16} className="animate-spin text-primary" />}
        </div>

        {isLoading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-surface" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center">
            <p className="font-display font-bold">Không tải được danh sách mẫu câu hỏi</p>
            <button onClick={() => refetch()} className="btn-primary mt-4">
              Thử lại
            </button>
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <SearchX size={36} className="text-primary" />
            <p className="font-display font-bold">Chưa có mẫu câu hỏi nào</p>
          </div>
        ) : (
          <ul className={`divide-y divide-outline transition-opacity ${isFetching ? "opacity-60" : ""}`}>
            {templates.map((t) => (
              <li key={t.id} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-base ${t.isActive ? "" : "text-navy/50"}`}>{t.title}</h3>
                    {t.latestPublished ? (
                      <span className="rounded-full bg-secondary-tint px-2.5 py-0.5 text-xs font-bold text-secondary-dark">Đã ban hành v{t.latestPublished.version}</span>
                    ) : (
                      <span className="rounded-full bg-outline px-2.5 py-0.5 text-xs font-bold text-navy/60">Chưa ban hành</span>
                    )}
                    {t.draft && <span className="rounded-full bg-primary-tint px-2.5 py-0.5 text-xs font-bold text-primary-dark">Có bản nháp</span>}
                    {!t.isActive && <span className="rounded-full bg-outline px-2 py-0.5 text-xs font-bold text-navy/60">Đã tắt</span>}
                  </div>
                  <p className="mt-1 text-sm text-navy/65">
                    {ANSWER_FORMATS[t.answerFormat]} · Kỹ năng con: {t.subSkill?.nameVi}
                  </p>
                  {t.latestPublished?.questionFrame && <p className="mt-1 line-clamp-1 text-xs text-navy/50">{t.latestPublished.questionFrame}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button onClick={() => setComposing(t.id)} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-sm font-bold hover:bg-outline">
                    <PenLine size={15} /> {t.draft ? "Sửa bản nháp" : "Soạn bản mới"}
                  </button>
                  <Switch
                    checked={t.isActive}
                    onChange={() => toggleActive(t)}
                    disabled={update.isPending && update.variables?.id === t.id}
                    label={t.isActive ? "Tắt mẫu" : "Bật lại mẫu"}
                  />
                  <button onClick={() => setDeleting(t)} className="rounded-full p-2 text-navy/60 hover:bg-danger-tint hover:text-danger" aria-label="Xóa mẫu câu hỏi">
                    <Trash2 size={17} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {creating && (
        <CreateTemplateModal
          subSkills={subSkills}
          defaultSubSkillId={subSkillId === "all" ? "" : subSkillId}
          onClose={() => setCreating(false)}
          onCreated={(t) => {
            setCreating(false);
            setComposing(t.id);
          }}
        />
      )}
      {composingTemplate && <TemplateVersionForm key={composingTemplate.id} template={composingTemplate} onClose={() => setComposing(null)} />}

      <Modal
        open={!!deleting}
        onClose={closeDelete}
        title={`Xóa mẫu "${deleting?.title ?? ""}"?`}
        description="Chỉ xóa hẳn được khi chưa có điểm dừng nào dùng mẫu. Nếu đã dùng, hãy tắt mẫu."
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
              {remove.isPending ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} Xóa mẫu
            </button>
          </>
        }
      >
        {deleteError && <p className="text-sm font-semibold text-red-600">{deleteError}</p>}
      </Modal>
    </div>
  );
}

export default TemplatesPage;
