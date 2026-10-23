import { useRef, useState } from "react";
import { Copy, FileQuestion, Loader2, PenLine, Plus, SearchX, Trash2 } from "lucide-react";
import Switch from "../../components/common/Switch";
import TemplateVersionForm from "../../components/specialist/TemplateVersionForm";
import { ANSWER_FORMATS } from "../../constants/story";
import { PaginationBar } from "../../components/common/Pagination";
import useClientPage from "../../hooks/useClientPage";
import { useDeleteTemplate, useDuplicateTemplate, useSubSkills, useTemplates, useUpdateTemplate } from "../../hooks/usePedagogy";
import { toast } from "../../stores/toastStore";
import { Select } from "../../components/ui";
import { ConfirmDialog } from "../../components/ui";


function TemplatesPage() {
  const [subSkillId, setSubSkillId] = useState("all");
  const [creating, setCreating] = useState(false);
  const [composing, setComposing] = useState(null); // mẫu đang soạn (ưu tiên bản mới nhất trong danh sách)
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  const { data: subSkills = [] } = useSubSkills({});
  const { data: templates = [], isLoading, isFetching, isError, refetch } = useTemplates({ subSkillId });
  const update = useUpdateTemplate();
  const remove = useDeleteTemplate();
  const duplicate = useDuplicateTemplate();
  const listRef = useRef(null);
  const paged = useClientPage(templates, 10, subSkillId);
  const goPage = (p) => {
    paged.setPage(p);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const composingTemplate = composing && (templates.find((t) => t.id === composing.id) ?? composing);

  // Nhân bản: mẫu mới cùng kỹ năng con + dạng, bản nháp v1 chép nội dung → mở ngay để soạn tiếp
  const onDuplicate = (t) =>
    duplicate.mutate(t.id, {
      onSuccess: (copy) => {
        toast.success("Đã nhân bản mẫu, hãy chỉnh nội dung bản nháp");
        setComposing(copy);
      },
      onError: (err) => toast.error(err.message),
    });

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
            Mẫu câu hỏi viết theo kỹ năng con (không theo sự việc), dùng cho mọi truyện AI. Bản đã ban hành không bị sửa; muốn đổi thì soạn bản nháp mới rồi ban hành.
          </p>
        </div>
        <button onClick={() => setCreating(true)} disabled={!subSkills.length} className="btn-primary shrink-0 self-start whitespace-nowrap disabled:opacity-60 md:self-auto">
          <Plus size={20} /> Thêm mẫu câu hỏi
        </button>
      </div>

      <div className="rounded-card bg-white p-4 shadow-low">
        <div className="lg:w-96">
          <Select
            label="Lọc theo kỹ năng con"
            value={subSkillId}
            onChange={setSubSkillId}
            shape="pill"
            options={[{ value: "all", label: "Mọi kỹ năng con" }, ...subSkills.map((s) => ({ value: s.id, label: s.nameVi }))]}
          />
        </div>
      </div>

      <section ref={listRef} className="card scroll-mt-24 overflow-hidden">
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
            {paged.pageItems.map((t) => (
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
                  <button onClick={() => setComposing(t)} className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-sm font-bold hover:bg-outline">
                    <PenLine size={15} /> {t.draft ? "Sửa bản nháp" : "Soạn bản mới"}
                  </button>
                  <button
                    onClick={() => onDuplicate(t)}
                    disabled={duplicate.isPending}
                    className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-sm font-bold hover:bg-outline disabled:opacity-60"
                  >
                    {duplicate.isPending && duplicate.variables === t.id ? <Loader2 size={15} className="animate-spin" /> : <Copy size={15} />} Nhân bản
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
        <PaginationBar {...paged} unit="mẫu" onChange={goPage} />
      </section>

      {creating && (
        <TemplateVersionForm subSkills={subSkills} defaultSubSkillId={subSkillId === "all" ? "" : subSkillId} onClose={() => setCreating(false)} />
      )}
      {composingTemplate && (
        <TemplateVersionForm key={composingTemplate.id} template={composingTemplate} subSkills={subSkills} onClose={() => setComposing(null)} />
      )}

      <ConfirmDialog
        open={!!deleting}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        loading={remove.isPending}
        title={`Xóa mẫu "${deleting?.title ?? ""}"?`}
        description="Chỉ xóa hẳn được khi chưa có điểm dừng nào dùng mẫu. Nếu đã dùng, hãy tắt mẫu."
        confirmLabel="Xóa mẫu"
      >
        {deleteError && <p className="rounded-xl bg-danger-tint/60 px-3 py-2 text-sm font-semibold text-danger-dark">{deleteError}</p>}
      </ConfirmDialog>
    </div>
  );
}

export default TemplatesPage;
