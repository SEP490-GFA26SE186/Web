import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Lock, PartyPopper, Volume2 } from "lucide-react";
import KidCheckpoint from "../../components/kid/KidCheckpoint";
import { StoryCompleteDialog } from "../../components/kid/KidDialogs";
import { ROUTES } from "../../constants/routes";
import { useCompleteReading, useReading, useSaveProgress, useUiAudio } from "../../hooks/useKid";
import { getErrorMessage } from "../../services/api";
import useKidSessionStore from "../../stores/kidSessionStore";
import useKidStore from "../../stores/kidStore";
import { playAudio, stopAudio } from "../../utils/kidAudio";

const STAGE_TONES = ["from-primary-tint to-secondary-tint", "from-secondary-tint to-primary-tint", "from-navy-tint to-secondary-tint"];
const STAGE_EMOJI = ["🏡", "🌳", "🧸", "🌙", "🌈", "🦉"];

/**
 * Đọc truyện tuyến tính (rev8): trang → (điểm dừng sau trang, nếu có) → trang tiếp.
 * Không qua được trang khi điểm dừng ngay sau nó chưa xong. Tranh: ảnh giữ chỗ (luồng ảnh đã bỏ).
 */
function Reader({ session, story }) {
  const navigate = useNavigate();
  const child = useKidSessionStore((s) => s.child);
  const { muted, setParentGateOpen } = useKidStore();
  const { data: ui = {} } = useUiAudio();
  const saveProgress = useSaveProgress(session.id);
  const complete = useCompleteReading(session.id);

  const pages = story.pages;
  const startIndex = Math.max(0, pages.findIndex((p) => p.id === session.currentPageId));
  const [index, setIndex] = useState(startIndex);
  const [results, setResults] = useState(
    () => new Map(story.checkpoints.filter((c) => c.result).map((c) => [c.id, c.result])),
  );
  const [atCheckpoint, setAtCheckpoint] = useState(false);
  const [finished, setFinished] = useState(false);

  const page = pages[index];
  const checkpoint = useMemo(() => story.checkpoints.find((c) => c.afterPageId === page.id), [story, page]);
  const checkpointDone = !checkpoint || results.get(checkpoint.id)?.done;
  const isLast = index === pages.length - 1;

  // Sang trang mới: đọc trang (nếu không tắt tiếng), lưu tiến độ.
  useEffect(() => {
    if (!muted) playAudio(page.audioUrl);
    saveProgress.mutate(page.id);
    return stopAudio;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ chạy khi đổi trang
  }, [page.id]);

  useEffect(() => {
    if (atCheckpoint && checkpoint && !muted) playAudio(checkpoint.questionAudioUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ khi mở điểm dừng
  }, [atCheckpoint]);

  const goTo = (i) => {
    setAtCheckpoint(false);
    setIndex(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    if (checkpoint && !atCheckpoint && !checkpointDone) return setAtCheckpoint(true);
    if (!checkpointDone) return;
    if (!isLast) return goTo(index + 1);
    complete.mutate(undefined, {
      onSuccess: () => {
        setFinished(true);
        if (!muted) playAudio(ui["prompt.story_end"]?.audioUrl);
      },
    });
  };

  const showCheckpoint = checkpoint && (atCheckpoint || results.has(checkpoint.id));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-3 rounded-stage bg-white px-5 py-4 shadow-low">
        <div className="min-w-0">
          <p className="text-sm font-bold text-primary-dark">{child?.name ?? "Bé"} đang đọc</p>
          <h1 className="truncate text-xl">{story.title}</h1>
        </div>
        <span className="shrink-0 rounded-full bg-secondary-tint px-3 py-1 text-sm font-bold text-secondary-dark">
          Trang {page.pageOrder}/{pages.length}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-outline" aria-hidden="true">
        <div className="h-full rounded-full bg-gradient-to-r from-secondary to-primary transition-all" style={{ width: `${((index + 1) / pages.length) * 100}%` }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className={`grid h-72 place-items-center rounded-stage bg-gradient-to-br shadow-mid sm:h-96 lg:col-span-6 ${STAGE_TONES[index % STAGE_TONES.length]}`}>
          {page.imageUrl ? (
            <img src={page.imageUrl} alt="" className="h-full w-full rounded-stage object-cover" />
          ) : (
            <span className="text-[140px] drop-shadow-xl select-none" aria-hidden="true">
              {STAGE_EMOJI[index % STAGE_EMOJI.length]}
            </span>
          )}
        </div>
        <article className="flex flex-col justify-between gap-4 rounded-stage bg-white p-6 shadow-low lg:col-span-6">
          <p className="font-display text-2xl leading-relaxed whitespace-pre-line">{page.text}</p>
          {page.audioUrl && (
            <button type="button" onClick={() => playAudio(page.audioUrl)} className="inline-flex items-center gap-2 self-start rounded-full bg-secondary-tint px-5 py-2.5 font-bold text-secondary-dark">
              <Volume2 size={20} /> Nghe lại trang này
            </button>
          )}
        </article>
      </div>

      {showCheckpoint && (
        <KidCheckpoint
          key={checkpoint.id}
          sessionId={session.id}
          checkpoint={checkpoint}
          result={results.get(checkpoint.id) ?? null}
          onDone={(r) => setResults((m) => new Map(m).set(checkpoint.id, r))}
        />
      )}

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="flex items-center gap-2 rounded-full bg-outline/80 px-6 py-3 font-display font-bold shadow-low transition hover:bg-outline disabled:opacity-40"
        >
          <ArrowLeft size={20} /> Trang trước
        </button>
        <button
          type="button"
          onClick={next}
          disabled={complete.isPending || (atCheckpoint && !checkpointDone)}
          className="flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 font-display text-lg font-bold text-white shadow-mid transition hover:bg-primary-dark disabled:opacity-50"
        >
          {checkpoint && !checkpointDone && !atCheckpoint ? (
            <>Trả lời câu hỏi 🦉</>
          ) : isLast ? (
            <>
              Hoàn thành <PartyPopper size={22} />
            </>
          ) : (
            <>
              Trang sau <ArrowRight size={22} />
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => setParentGateOpen(true)}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-navy/50 hover:text-navy"
        >
          <Lock size={15} /> Dành cho Ba Mẹ
        </button>
      </div>

      {finished && (
        <StoryCompleteDialog
          childName={child?.name ?? "Bé"}
          onReadAgain={() => window.location.reload()}
          onBookshelf={() => {
            stopAudio();
            navigate(ROUTES.KID.BOOKSHELF);
          }}
        />
      )}
    </div>
  );
}

function StoryReaderPage() {
  const { storyId } = useParams();
  const { data, isLoading, error } = useReading(storyId);

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
        <div className="h-20 animate-pulse rounded-stage bg-surface" />
        <div className="h-96 animate-pulse rounded-stage bg-surface" />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="card mx-auto mt-16 max-w-md p-8 text-center">
        <p className="text-5xl">🦉</p>
        <p className="mt-3 font-display text-lg font-bold">Cú Weaver chưa mở được câu chuyện này</p>
        <p className="mt-2 text-navy/60">{error ? getErrorMessage(error, "Bé nhờ ba mẹ xem lại nhé.") : null}</p>
      </div>
    );
  }
  return <Reader key={data.session.id} session={data.session} story={data.story} />;
}

/** /kid/story → về tủ sách để bé chọn truyện. */
export function KidReaderIndex() {
  return <Navigate to={ROUTES.KID.BOOKSHELF} replace />;
}

export default StoryReaderPage;
