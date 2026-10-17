import { Fragment, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bot, CheckCircle2, Loader2, PenLine, Plus, Trash2 } from "lucide-react";
import CaselTag from "../../../components/parent/library/CaselTag";
import CheckpointEditor from "../../../components/parent/studio/CheckpointEditor";
import GenerationPanel from "../../../components/parent/studio/GenerationPanel";
import PageEditor, { fieldClass } from "../../../components/parent/studio/PageEditor";
import { CHECKPOINT_TYPES, NEEDS_TARGET, STORY_STATUS_LABELS } from "../../../constants/story";
import { STORY_LENGTH_LABELS } from "../../../constants/casel";
import { ROUTES } from "../../../constants/routes";
import {
  isGenerating,
  useDeleteStory,
  useGenerateStory,
  useGeneration,
  useStory,
  useStoryEditor,
} from "../../../hooks/useStudio";
import { toast } from "../../../stores/toastStore";

// Lỗi theo đường dẫn của BE: "pages.<id>" / "checkpoints.<id>" → câu báo, để tô đỏ đúng chỗ
const gapsByPath = (errors) => Object.fromEntries(errors.map((e) => [e.path, e.message]));
// "pages.<id>" → id phần tử "page-<id>" (PageEditor), "checkpoints.<id>" → "checkpoint-<id>"
const elementIdOf = (path = "") => path.replace(/^pages\./, "page-").replace(/^checkpoints\./, "checkpoint-");

/** Thêm điểm dừng sau một trang (chỉ truyện tự viết). BE kiểm luật: không sau trang 1, reflection chỉ ở cuối… */
function AddCheckpointForm({ page, characters, onAdd, adding, onCancel }) {
  const [type, setType] = useState("emotion_self");
  const others = characters.filter((c) => !c.isMain);
  const [target, setTarget] = useState(others[0]?.token ?? "");
  const needsTarget = NEEDS_TARGET.includes(type);

  return (
    <div className="ml-4 flex flex-wrap items-end gap-3 rounded-card border-2 border-dashed border-outline bg-surface p-4 sm:ml-10">
      <label className="min-w-56 flex-1">
        <span className="mb-1.5 block text-sm font-semibold">Kiểu điểm dừng sau trang {page.pageOrder}</span>
        <select value={type} onChange={(e) => setType(e.target.value)} className={fieldClass}>
          {Object.entries(CHECKPOINT_TYPES).map(([value, { label }]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {needsTarget && (
        <label className="min-w-44">
          <span className="mb-1.5 block text-sm font-semibold">Hỏi về</span>
          <select value={target} onChange={(e) => setTarget(e.target.value)} className={fieldClass}>
            {others.map((c) => (
              <option key={c.token} value={c.token}>
                {c.name ?? c.token}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="btn-ghost px-4 py-2 text-sm">
          Hủy
        </button>
        <button
          type="button"
          disabled={adding || (needsTarget && !target)}
          onClick={() => onAdd({ type, afterPageId: page.id, ...(needsTarget && { targetToken: target }) })}
          className="btn-primary px-4 py-2 text-sm disabled:opacity-60"
        >
          {adding && <Loader2 size={16} className="animate-spin" />} Thêm
        </button>
      </div>
    </div>
  );
}

/** Xóa cả truyện: bấm lần 1 hiện xác nhận ngay tại chỗ, bấm "Xóa hẳn" mới gọi API. */
function DeleteStoryButton({ onConfirm, deleting, disabled }) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={disabled}
        className="inline-flex items-center gap-1 text-sm font-semibold text-danger hover:underline disabled:opacity-50"
      >
        <Trash2 size={15} /> Xóa truyện
      </button>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-semibold text-danger">Xóa truyện này? Không khôi phục được.</span>
      <button type="button" onClick={() => setConfirming(false)} className="btn-ghost px-3 py-1.5 text-sm">
        Giữ lại
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={deleting}
        className="inline-flex items-center gap-1 rounded-full bg-danger px-3 py-1.5 font-semibold text-white disabled:opacity-60"
      >
        {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />} Xóa hẳn
      </button>
    </div>
  );
}

function StoryEditorPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const removeStory = useDeleteStory();
  const { data: story, isLoading, error } = useStory(storyId);
  const isCustom = story?.length === "custom";
  const generation = useGeneration(storyId, { enabled: !!story && !isCustom });
  const generate = useGenerateStory(storyId);
  const editor = useStoryEditor(storyId);
  const [gaps, setGaps] = useState({});
  const [addingAfter, setAddingAfter] = useState(null);

  if (isLoading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }
  if (error) return <p className="card p-6 text-danger">{error.message}</p>;

  const characters = story.characters;
  const busy = story.status === "generating" || isGenerating(generation.data);
  const allEmpty = story.pages.every((p) => !p.contentText);
  const neverGenerated = !isCustom && !generation.data && allEmpty;
  const failedEmpty = ["failed", "blocked"].includes(generation.data?.status) && allEmpty;
  // Truyện AI chưa có chữ (chưa sinh / sinh lỗi) → chỉ hiện khung sinh truyện, chưa hiện editor
  const showEditor = !busy && !neverGenerated && !failedEmpty;
  const checkpointAfter = new Map(story.checkpoints.map((c) => [c.afterPageId, c]));

  const run = (mutation, args, { success, after } = {}) =>
    mutation.mutate(args, {
      onSuccess: () => {
        if (success) toast.success(success);
        after?.();
      },
      onError: (err) => {
        if (err.errors?.length) setGaps((g) => ({ ...g, ...gapsByPath(err.errors) }));
        toast.error(err.errors?.[0]?.message || err.message);
      },
    });

  const finish = () =>
    editor.review.mutate(undefined, {
      onSuccess: () => {
        setGaps({});
        toast.success("Đã hoàn tất truyện");
      },
      onError: (err) => {
        const found = gapsByPath(err.errors ?? []);
        setGaps(found);
        const first = err.errors?.[0]?.path;
        if (first) document.getElementById(elementIdOf(first))?.scrollIntoView({ behavior: "smooth", block: "center" });
        toast.error(err.errors?.length ? `Còn ${err.errors.length} chỗ chưa viết xong` : err.message);
      },
    });

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-28">
      <Link to={ROUTES.PARENT.STUDIO} className="inline-flex items-center gap-1 text-sm font-semibold text-navy/60 hover:text-primary">
        <ArrowLeft size={16} /> Truyện của ba mẹ
      </Link>

      <header className="card space-y-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <CaselTag competency={story.topic?.competency} className="bg-secondary-tint" />
          <span className="tag-theme">
            {isCustom ? <PenLine size={12} /> : <Bot size={12} />}
            {isCustom ? "Tự viết" : `AI viết giúp · ${STORY_LENGTH_LABELS[story.length]}`}
          </span>
          <span className="tag-eq">{story.reviewedAt ? "Đã hoàn tất" : STORY_STATUS_LABELS[story.status]}</span>
        </div>
        <h1 className="text-2xl">{story.title}</h1>
        <p className="text-sm text-navy/65">
          Bài học: <span className="font-semibold text-navy">{story.topic?.title}</span> · Nhân vật:{" "}
          {characters.map((c) => c.name).filter(Boolean).join(", ")}
        </p>
        <DeleteStoryButton
          disabled={busy}
          deleting={removeStory.isPending}
          onConfirm={() =>
            removeStory.mutate(storyId, {
              onSuccess: () => {
                toast.success("Đã xóa truyện");
                navigate(ROUTES.PARENT.STUDIO, { replace: true });
              },
              onError: (err) => toast.error(err.message),
            })
          }
        />
      </header>

      {!isCustom && (
        <GenerationPanel
          generation={generation.data}
          busy={busy}
          neverGenerated={neverGenerated}
          onStart={() => run(generate)}
          starting={generate.isPending}
          startError={generate.error?.status === 402 ? "Ba mẹ không đủ credit để AI viết truyện." : generate.error?.message}
        />
      )}

      {showEditor && (
        <>
          {story.pages.map((page) => {
            const cp = checkpointAfter.get(page.id);
            return (
              <Fragment key={page.id}>
                <PageEditor
                  key={`${page.id}:${page.contentText}`}
                  page={page}
                  characters={characters}
                  disabled={busy}
                  gap={gaps[`pages.${page.id}`]}
                  saving={editor.updatePage.isPending && editor.updatePage.variables?.pageId === page.id}
                  onSave={(contentText) =>
                    run(editor.updatePage, { pageId: page.id, contentText }, {
                      success: `Đã lưu trang ${page.pageOrder}`,
                      after: () => setGaps((g) => ({ ...g, [`pages.${page.id}`]: undefined })),
                    })
                  }
                  onDelete={isCustom ? () => run(editor.deletePage, page.id, { success: "Đã xóa trang" }) : undefined}
                  deleting={editor.deletePage.isPending && editor.deletePage.variables === page.id}
                />
                {cp && (
                  <CheckpointEditor
                    key={`${cp.id}:${JSON.stringify([cp.question, cp.hint, cp.answerEmotion, cp.options])}`}
                    checkpoint={cp}
                    characters={characters}
                    disabled={busy}
                    gap={gaps[`checkpoints.${cp.id}`]}
                    saving={editor.updateCheckpoint.isPending && editor.updateCheckpoint.variables?.checkpointId === cp.id}
                    onSave={(body, done) =>
                      run(editor.updateCheckpoint, { checkpointId: cp.id, body }, {
                        success: "Đã lưu điểm dừng",
                        after: () => {
                          done();
                          setGaps((g) => ({ ...g, [`checkpoints.${cp.id}`]: undefined }));
                        },
                      })
                    }
                    onDelete={isCustom ? () => run(editor.deleteCheckpoint, cp.id, { success: "Đã xóa điểm dừng" }) : undefined}
                    deleting={editor.deleteCheckpoint.isPending && editor.deleteCheckpoint.variables === cp.id}
                  />
                )}
                {isCustom && !cp && page.pageOrder > 1 &&
                  (addingAfter === page.id ? (
                    <AddCheckpointForm
                      page={page}
                      characters={characters}
                      adding={editor.createCheckpoint.isPending}
                      onCancel={() => setAddingAfter(null)}
                      onAdd={(body) =>
                        run(editor.createCheckpoint, body, { success: "Đã thêm điểm dừng", after: () => setAddingAfter(null) })
                      }
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAddingAfter(page.id)}
                      className="ml-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary-dark hover:underline sm:ml-10"
                    >
                      <Plus size={16} /> Thêm điểm dừng sau trang {page.pageOrder}
                    </button>
                  ))}
              </Fragment>
            );
          })}

          {isCustom && (
            <button
              type="button"
              onClick={() => run(editor.createPage, undefined, { success: "Đã thêm trang" })}
              disabled={editor.createPage.isPending}
              className="btn-ghost w-full disabled:opacity-60"
            >
              {editor.createPage.isPending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />} Thêm trang
            </button>
          )}
        </>
      )}

      {showEditor && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-outline bg-white/95 px-4 py-3 backdrop-blur" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            <p className="text-sm text-navy/65">
              {story.reviewedAt
                ? "Truyện đã hoàn tất. Sửa thêm thì bấm hoàn tất lại."
                : "Xem lại hết các trang và điểm dừng rồi bấm hoàn tất."}
            </p>
            <button type="button" onClick={finish} disabled={editor.review.isPending || busy} className="btn-primary disabled:opacity-60">
              {editor.review.isPending ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              Hoàn tất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryEditorPage;
