import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Lock, PartyPopper } from "lucide-react";
import DecisionPoint from "../../components/kid/DecisionPoint";
import IllustrationStage from "../../components/kid/IllustrationStage";
import { ChoiceResultDialog, StoryCompleteDialog } from "../../components/kid/KidDialogs";
import ReadAlongPanel from "../../components/kid/ReadAlongPanel";
import StoryProgressMap from "../../components/kid/StoryProgressMap";
import { ROUTES } from "../../constants/routes";
import { useCompleteStory, useKidStory, useSaveProgress, useSubmitChoice } from "../../hooks/useKid";
import { useSelectedChild } from "../../hooks/useChildProfile";
import useUsageTracker from "../../hooks/useUsageTracker";
import useKidStore from "../../stores/kidStore";
import { toast } from "../../stores/toastStore";
import { stopSpeaking } from "../../utils/speech";

// Ghép nội dung trang theo lựa chọn của bé ở điểm rẽ gần nhất phía trước
const resolvePage = (page, pages, choices) => {
  if (!page.variants) return page;
  const decisionPage = [...pages].reverse().find((p) => p.number < page.number && p.decision);
  const choiceId = decisionPage && choices[decisionPage.number];
  return choiceId && page.variants[choiceId] ? { ...page, ...page.variants[choiceId] } : page;
};

function Reader({ story, progress, child }) {
  const navigate = useNavigate();
  const { muted, rate, setParentGateOpen } = useKidStore();
  const [current, setCurrent] = useState(progress.currentPage);
  const [maxReached, setMaxReached] = useState(progress.currentPage);
  const [result, setResult] = useState(null); // { feedback }
  const [completed, setCompleted] = useState(false);
  const [shake, setShake] = useState(0);

  const saveProgress = useSaveProgress(story.id);
  const submitChoice = useSubmitChoice(story.id);
  const complete = useCompleteStory(story.id);

  const total = story.pages.length;
  const page = resolvePage(story.pages[current - 1], story.pages, progress.choices);
  const chosenId = progress.choices[current];
  const needsChoice = page.decision && !chosenId;

  const goTo = (n) => {
    stopSpeaking();
    setCurrent(n);
    setMaxReached((m) => Math.max(m, n));
    saveProgress.mutate(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (needsChoice) {
      setShake((s) => s + 1);
      document.getElementById("decision-point")?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.info("Bé chọn 1 cách giúp Roco trước nhé! 🌟");
      return;
    }
    if (current < total) return goTo(current + 1);
    complete.mutate(undefined, { onSuccess: () => setCompleted(true) });
  };

  const handleChoose = (choice) =>
    submitChoice.mutate(
      { pageNumber: current, choice },
      {
        onSuccess: () => setResult({ feedback: choice.feedback }),
        onError: () => toast.error("Ôi, chưa lưu được lựa chọn. Bé thử lại nhé!"),
      },
    );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <StoryProgressMap
        child={child}
        total={total}
        current={current}
        maxReached={maxReached}
        onJump={goTo}
        caselFocus={story.caselFocus}
      />

      <div className="grid w-full grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-7">
          <IllustrationStage key={`stage-${current}`} page={page} title={story.title} muted={muted} rate={rate} />
        </div>
        <ReadAlongPanel key={`read-${current}`} segments={page.segments} tip={page.tip} narrator={story.narrator} />
      </div>

      {page.decision && (
        <div id="decision-point" key={`decision-${shake}`}>
          <DecisionPoint
            decision={page.decision}
            childName={child?.name ?? "bé"}
            chosenId={chosenId}
            onChoose={handleChoose}
            pendingId={submitChoice.isPending ? submitChoice.variables?.choice.id : null}
            shake={shake > 0}
          />
        </div>
      )}

      <div className="flex w-full flex-col items-center justify-between gap-4 py-2 sm:flex-row">
        <span className="hidden w-36 sm:block" />

        <div className="flex items-center gap-4">
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 1}
            className="flex items-center gap-2 rounded-full bg-outline/80 px-6 py-3 font-display font-bold shadow-low transition hover:bg-outline active:scale-95 disabled:opacity-40"
          >
            <ArrowLeft size={20} /> Trang trước
          </button>
          <button
            onClick={handleNext}
            disabled={complete.isPending}
            className={`flex items-center gap-2 rounded-full px-8 py-3.5 font-display text-lg font-bold text-white shadow-mid transition hover:-translate-y-0.5 active:scale-95 ${
              needsChoice ? "bg-primary/60" : "bg-primary hover:bg-primary-dark"
            }`}
          >
            {current === total ? (
              <>
                Hoàn thành <PartyPopper size={22} />
              </>
            ) : (
              <>
                Trang sau <ArrowRight size={22} />
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => setParentGateOpen(true)}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-navy/50 opacity-70 transition hover:text-navy hover:opacity-100"
        >
          <Lock size={15} /> Dành cho Ba Mẹ
        </button>
      </div>

      {result && (
        <ChoiceResultDialog
          childName={child?.name ?? "bé"}
          feedback={result.feedback}
          isLast={current + 1 === total}
          onNext={() => {
            setResult(null);
            goTo(Math.min(current + 1, total));
          }}
        />
      )}

      {completed && (
        <StoryCompleteDialog
          childName={child?.name ?? "Bé"}
          onReadAgain={() => {
            setCompleted(false);
            goTo(1);
          }}
          onBookshelf={() => {
            stopSpeaking();
            navigate(ROUTES.KID.BOOKSHELF);
          }}
        />
      )}
    </div>
  );
}

function StoryReaderPage() {
  const { storyId } = useParams();
  const { data, isLoading, isError } = useKidStory(storyId);
  const { child } = useSelectedChild();
  useUsageTracker(child?.id);

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6">
        <div className="h-24 animate-pulse rounded-stage bg-surface" />
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="h-[480px] animate-pulse rounded-stage bg-surface lg:col-span-7" />
          <div className="h-[480px] animate-pulse rounded-stage bg-surface lg:col-span-5" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="card mx-auto mt-16 max-w-md p-8 text-center">
        <p className="text-5xl">🦉</p>
        <p className="mt-3 font-display text-lg font-bold">Cú Weaver chưa tìm thấy câu chuyện này</p>
      </div>
    );
  }

  return <Reader key={data.story.id} story={data.story} progress={data.progress} child={child} />;
}

// /kid/story → mở truyện bé đang đọc dở (mock: s_101)
export function KidReaderIndex() {
  return <Navigate to={ROUTES.KID.story("s_101")} replace />;
}

export default StoryReaderPage;
