import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Lightbulb, Loader2, Volume2 } from "lucide-react";
import { useAnswer, useUiAudio } from "../../hooks/useKid";
import useKidStore from "../../stores/kidStore";
import { playAudio } from "../../utils/kidAudio";

const EMOTIONS = [
  { value: "happy", label: "Vui", emoji: "😄" },
  { value: "sad", label: "Buồn", emoji: "😢" },
  { value: "angry", label: "Giận", emoji: "😠" },
  { value: "scared", label: "Sợ", emoji: "😨" },
  { value: "neutral", label: "Bình thường", emoji: "😐" },
];
const EMOTION_TYPES = ["emotion_self", "emotion_other"];

/** ms từ lúc điểm dừng hiện ra tới lần chọn (time_to_first_ms). */
const elapsedSince = (start) => (start ? Date.now() - start : null);

const choiceBtn =
  "flex items-center gap-3 rounded-card border-2 bg-white px-5 py-4 text-left font-display text-lg font-bold shadow-low transition hover:-translate-y-0.5 hover:shadow-mid active:scale-95 disabled:opacity-60";

/**
 * Điểm dừng sau một trang. BE chấm (POST /kid/sessions/:id/answers): không có đáp án ở máy bé.
 * emotion_* / perspective: sai lần đầu → gợi ý → chọn lại một lần → báo đáp án.
 * problem_solving: chọn một lần → phản hồi. reflection: bé kể cho ba mẹ rồi bấm tiếp tục.
 * `result` có sẵn khi tiếp tục lượt đọc dở; `onDone(result)` khi điểm dừng xong.
 */
function KidCheckpoint({ sessionId, checkpoint, result: initial, onDone }) {
  const muted = useKidStore((s) => s.muted);
  const { data: ui = {} } = useUiAudio();
  const answer = useAnswer(sessionId);
  const [result, setResult] = useState(initial);
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);
  const [replays, setReplays] = useState(0);
  const isEmotion = EMOTION_TYPES.includes(checkpoint.type);
  const done = result?.done;

  const say = (url) => !muted && playAudio(url);

  const send = (choice) =>
    answer.mutate(
      { checkpointId: checkpoint.id, ...choice, timeToFirstMs: elapsedSince(shownAt.current) ?? undefined, questionReplays: replays },
      {
        onSuccess: (r) => {
          setResult(r);
          if (!r.done) say(r.hintAudioUrl ?? ui["prompt.try_again"]?.audioUrl);
          else if (r.feedbackAudioUrl) say(r.feedbackAudioUrl);
          else if (r.correct) say(ui["prompt.correct"]?.audioUrl);
          else if (r.correct === false) say(ui["prompt.answer_is"]?.audioUrl);
          if (r.done) onDone?.(r);
        },
      },
    );

  const replayQuestion = () => {
    setReplays((n) => n + 1);
    say(checkpoint.questionAudioUrl);
  };

  const pending = answer.isPending;
  const revealed = done && result?.correct === false ? result.answer : null;

  return (
    <section className="rounded-stage bg-white p-6 shadow-mid" aria-live="polite">
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-tint text-2xl">🦉</span>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl">{checkpoint.question}</h2>
          {checkpoint.questionAudioUrl && (
            <button type="button" onClick={replayQuestion} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-secondary-dark">
              <Volume2 size={16} /> Nghe câu hỏi
            </button>
          )}
        </div>
      </div>

      {checkpoint.type === "reflection" ? (
        <div className="mt-5">
          <p className="text-navy/70">{ui["prompt.reflection"]?.text ?? "Con kể cho ba mẹ nghe nhé."}</p>
          {!done && (
            <button type="button" disabled={pending} onClick={() => send({})} className="btn-primary mt-4 px-8 py-3 text-lg">
              {pending ? <Loader2 size={20} className="animate-spin" /> : null} Con kể xong rồi
            </button>
          )}
        </div>
      ) : isEmotion ? (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {EMOTIONS.map((e) => {
            const isAnswer = revealed?.emotion === e.value;
            return (
              <button
                key={e.value}
                type="button"
                disabled={pending || done}
                onClick={() => {
                  say(ui[`emotion.${e.value}`]?.audioUrl);
                  send({ emotion: e.value });
                }}
                aria-label={e.label}
                className={`${choiceBtn} flex-col justify-center ${isAnswer ? "border-secondary bg-secondary-tint" : "border-transparent"}`}
              >
                <span className="text-5xl" aria-hidden="true">{e.emoji}</span>
                <span>{e.label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
          {checkpoint.options.map((o) => {
            const isAnswer = revealed?.optionId === o.id;
            return (
              <button
                key={o.id}
                type="button"
                disabled={pending || done}
                onClick={() => {
                  say(o.textAudioUrl);
                  send({ optionId: o.id });
                }}
                className={`${choiceBtn} ${isAnswer ? "border-secondary bg-secondary-tint" : "border-transparent"}`}
              >
                {o.text}
              </button>
            );
          })}
        </div>
      )}

      {result && !done && (
        <p className="mt-5 flex items-start gap-2 rounded-card bg-primary-tint p-4 font-semibold text-primary-dark">
          <Lightbulb size={22} className="shrink-0" /> {result.hint ?? "Con thử chọn lại nhé!"}
        </p>
      )}
      {done && (
        <p className="mt-5 flex items-start gap-2 rounded-card bg-secondary-tint p-4 font-semibold text-secondary-dark">
          <CheckCircle2 size={22} className="shrink-0" />
          {result.feedback ?? (result.correct ? "Đúng rồi! Con giỏi quá!" : result.correct === false ? "Đáp án là ô đang sáng nè. Mình cùng nhớ nhé!" : "Cảm ơn con đã kể!")}
        </p>
      )}
      {answer.isError && <p className="mt-3 text-sm font-semibold text-danger">Chưa gửi được. Con bấm lại nhé!</p>}
    </section>
  );
}

export default KidCheckpoint;
