import { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Bot, CheckCircle2, Loader2, PenLine, Plus, RotateCcw, Store, Trash2 } from "lucide-react";
import CaselTag from "../../../components/parent/library/CaselTag";
import CheckpointEditor from "../../../components/parent/studio/CheckpointEditor";
import GenerationPanel from "../../../components/parent/studio/GenerationPanel";
import NarrationPanel from "../../../components/parent/studio/NarrationPanel";
import { narrationState } from "../../../components/parent/studio/narrationState";
import ShelfPanel from "../../../components/parent/studio/ShelfPanel";
import ScenePicture from "../../../components/parent/studio/ScenePicture";
import PageEditor, { fieldClass } from "../../../components/parent/studio/PageEditor";
import { CHECKPOINT_TYPES, NEEDS_TARGET, STORY_STATUS_LABELS } from "../../../constants/story";
import { STORY_LENGTH_LABELS } from "../../../constants/casel";
import { ROUTES } from "../../../constants/routes";
import {
  isGenerating,
  useAiPricing,
  useDeleteStory,
  useGenerateStory,
  useGeneration,
  useStory,
  useStoryEditor,
  useStoryImages,
} from "../../../hooks/useStudio";
import { toast } from "../../../stores/toastStore";

// Lỗi theo đường dẫn của BE: "pages.<id>" / "checkpoints.<id>" → câu báo, để tô đỏ đúng chỗ
const gapsByPath = (errors) => Object.fromEntries(errors.map((e) => [e.path, e.message]));
// "pages.<id>" → id phần tử "page-<id>" (PageEditor), "checkpoints.<id>" → "checkpoint-<id>"
// Từ `warn` (Moderator đặt) vẫn lưu được → nhắc phụ huynh cân nhắc; từ `block` BE trả 422 như một chỗ thiếu
const warningsByPath = (warnings = []) => {
  const byPath = {};
  for (const w of warnings) (byPath[w.path] ??= []).push(`“${w.keyword}”`);
  return Object.fromEntries(Object.entries(byPath).map(([path, kws]) => [path, `Có từ nên cân nhắc với bé: ${kws.join(", ")}. Ba mẹ xem diễn đạt nhẹ nhàng hơn nhé.`]));
};
const isKeywordBlock = (e) => e.message?.startsWith("Có từ không phù hợp");
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

/** Dòng trạng thái trên thanh Hoàn tất: chưa hoàn tất / đang tạo giọng đọc (x/y đoạn) / sẵn sàng / lỗi. */
function FinishBarStatus({ story, voice }) {
  if (!story.reviewedAt) return <p className="min-w-0 flex-1 text-sm text-navy/65">Xem lại hết các trang và điểm dừng rồi bấm hoàn tất.</p>;
  if (!voice) return <p className="min-w-0 flex-1 text-sm text-navy/65">Truyện đã hoàn tất. Sửa thêm thì bấm hoàn tất lại.</p>;
  const { phase, percent, n } = voice;
  if (phase === "working") {
    return (
      <div className="min-w-0 flex-1 space-y-1.5" aria-live="polite">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Loader2 size={16} className="shrink-0 animate-spin text-primary" />
          Đang tạo giọng đọc · {n.ready}/{n.total} đoạn
          <span className="hidden font-normal text-navy/55 sm:inline">— ba mẹ có thể rời trang</span>
        </p>
        <div className="h-1.5 overflow-hidden rounded-full bg-navy-tint" role="progressbar" aria-label="Tiến độ giọng đọc" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>
    );
  }
  if (phase === "ready") {
    return (
      <p className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold text-secondary-dark" aria-live="polite">
        <CheckCircle2 size={16} className="shrink-0" /> Giọng đọc đã sẵn sàng — bé nghe được truyện này.
      </p>
    );
  }
  return (
    <p className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold text-danger" aria-live="polite">
      <AlertTriangle size={16} className="shrink-0" />
      {phase === "failed" ? `Còn ${n.failed + n.missing} đoạn giọng đọc chưa tạo được.` : `Có ${n.missing} đoạn đã sửa chữ — bấm hoàn tất lại để đọc lại.`}
    </p>
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
  const pricing = useAiPricing();
  const images = useStoryImages(storyId);
  const editor = useStoryEditor(storyId);
  const [gaps, setGaps] = useState({});
  const [addingAfter, setAddingAfter] = useState(null);
  const voice = narrationState(story);

  // Giọng đọc chạy xong (đang tạo -> sẵn sàng / lỗi) trong lúc ba mẹ còn ở trang -> báo ngay.
  const prevPhase = useRef(voice?.phase);
  useEffect(() => {
    if (prevPhase.current === "working" && voice?.phase === "ready") toast.success("Giọng đọc đã sẵn sàng — bé nghe được truyện này rồi");
    if (prevPhase.current === "working" && voice?.phase === "failed") toast.error("Có đoạn giọng đọc bị lỗi — ba mẹ bấm “Thử lại” nhé");
    prevPhase.current = voice?.phase;
  }, [voice?.phase]);

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
  const warnings = warningsByPath(story.keywordWarnings);
  const checkpointAfter = new Map(story.checkpoints.map((c) => [c.afterPageId, c]));
  const sceneById = new Map((story.scenes ?? []).map((sc) => [sc.id, sc]));
  const sceneFirstPage = new Map();
  const scenePages = new Map();
  for (const p of story.pages) {
    if (!sceneFirstPage.has(p.sceneId)) sceneFirstPage.set(p.sceneId, p.id);
    scenePages.set(p.sceneId, [...(scenePages.get(p.sceneId) ?? []), p.pageOrder]);
  }
  const scenePageRange = new Map(
    [...scenePages].map(([id, orders]) => [id, orders.length > 1 ? `trang ${orders[0]}–${orders[orders.length - 1]}` : `trang ${orders[0]}`]),
  );

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
      onSuccess: (updated) => {
        setGaps({});
        toast.success(updated?.narration?.pending > 0 ? "Đã hoàn tất — đang tạo giọng đọc" : "Đã hoàn tất truyện");
      },
      onError: (err) => {
        const found = gapsByPath(err.errors ?? []);
        setGaps(found);
        const first = err.errors?.[0]?.path;
        if (first) document.getElementById(elementIdOf(first))?.scrollIntoView({ behavior: "smooth", block: "center" });
        const blocked = (err.errors ?? []).filter(isKeywordBlock).length;
        toast.error(
          blocked ? `Còn ${blocked} chỗ có từ không phù hợp cho bé, ba mẹ sửa giúp nhé` : err.errors?.length ? `Còn ${err.errors.length} chỗ chưa viết xong` : err.message,
        );
      },
    });

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-4">
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
          {story.topic ? (
            <>
              Bài học: <span className="font-semibold text-navy">{story.topic.title}</span> ·{" "}
            </>
          ) : null}
          Nhân vật:{" "}
          {characters.map((c) => c.name).filter(Boolean).join(", ")}
        </p>
        {story.reviewedAt && story.kind !== "published" && (
          <Link to={ROUTES.PARENT.sellingNew(story.id)} className="mr-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            <Store size={15} /> Đăng bán truyện này
          </Link>
        )}
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
          cost={pricing.data?.lengths?.find((p) => p.length === story.length)?.credits}
          generation={generation.data}
          busy={busy}
          neverGenerated={neverGenerated}
          onStart={() => run(generate)}
          starting={generate.isPending}
          startError={generate.error?.status === 402 ? "Ba mẹ không đủ credit để AI viết truyện." : generate.error?.message}
        />
      )}

      {showEditor && (
        <NarrationPanel
          story={story}
          retrying={editor.retryNarration.isPending}
          onRetry={() => run(editor.retryNarration, undefined, { success: "Đang tạo lại giọng đọc" })}
        />
      )}
      {showEditor && <ShelfPanel story={story} />}

      {showEditor && (
        <>
          {!isCustom && !story.useAiImage && story.scenes?.some((s) => s.description?.trim()) && (
            <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
              <div className="min-w-0">
                <p className="font-semibold">Thêm tranh minh hoạ AI</p>
                <p className="text-sm text-navy/60">
                  AI vẽ {story.scenes.length} cảnh theo chân dung nhân vật
                  {pricing.data?.images ? ` · ${pricing.data.images.scene} credit/cảnh, chân dung còn thiếu ${pricing.data.images.characterPortrait} credit` : ""}.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  images.drawAll.mutate(undefined, {
                    onSuccess: () => toast.success("Đang vẽ tranh cho truyện"),
                    onError: (e) => toast.error(e.message),
                  })
                }
                disabled={busy || images.drawAll.isPending}
                className="btn-primary whitespace-nowrap disabled:opacity-60"
              >
                {images.drawAll.isPending ? <Loader2 size={18} className="animate-spin" /> : null} Vẽ tranh cho truyện
              </button>
            </div>
          )}
          {story.pages.map((page) => {
            const cp = checkpointAfter.get(page.id);
            // Tranh của cảnh đặt trên trang đầu tiên của cảnh đó
            const scene = story.useAiImage ? sceneById.get(page.sceneId) : null;
            const firstOfScene = scene && sceneFirstPage.get(scene.id) === page.id;
            return (
              <Fragment key={page.id}>
                {firstOfScene && (
                  <ScenePicture
                    scene={scene}
                    pageRange={scenePageRange.get(scene.id)}
                    cost={pricing.data?.images?.scene}
                    disabled={busy}
                    redrawing={images.redraw.isPending && images.redraw.variables === scene.id}
                    onRedraw={() =>
                      images.redraw.mutate(scene.id, {
                        onSuccess: () => toast.success("Đang vẽ lại cảnh"),
                        onError: (e) => toast.error(e.message),
                      })
                    }
                  />
                )}
                <PageEditor
                  key={`${page.id}:${page.contentText}`}
                  page={page}
                  characters={characters}
                  disabled={busy}
                  gap={gaps[`pages.${page.id}`]}
                  warning={warnings[`pages.${page.id}`]}
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
                    warning={warnings[`checkpoints.${cp.id}`]}
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
        // Dinh day man hinh nhung nam TRONG cot noi dung: luon thang hang voi cac trang du sidebar thu gon hay mo rong.
        <div className="sticky z-20 rounded-2xl border border-outline bg-white/95 px-4 py-3 shadow-mid backdrop-blur" style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <FinishBarStatus story={story} voice={voice} />
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {voice?.phase === "failed" && (
                <button
                  type="button"
                  onClick={() => run(editor.retryNarration, undefined, { success: "Đang tạo lại giọng đọc" })}
                  disabled={editor.retryNarration.isPending}
                  className="btn-ghost py-2.5 whitespace-nowrap disabled:opacity-60"
                >
                  {editor.retryNarration.isPending ? <Loader2 size={18} className="animate-spin" /> : <RotateCcw size={18} />} Thử lại
                </button>
              )}
              <button type="button" onClick={finish} disabled={editor.review.isPending || busy} className="btn-primary whitespace-nowrap disabled:opacity-60">
                {editor.review.isPending ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryEditorPage;
