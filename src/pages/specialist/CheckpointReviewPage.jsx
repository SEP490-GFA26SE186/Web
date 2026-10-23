import { useState } from "react";
import { BarChart3, Check, CheckCircle2, Flag, FlagOff, Loader2, ScanSearch, SearchX } from "lucide-react";
import Modal from "../../components/common/Modal";
import CaselTag from "../../components/parent/library/CaselTag";
import { CHECKPOINT_TYPES, EMOTIONS, OPTION_ROLES } from "../../constants/story";
import {
  useCheckpointQueue,
  useCheckpointReviewStats,
  useFlagCheckpoint,
  useMarkCheckpointOk,
  useSubSkills,
  useTemplates,
  useUnflagCheckpoint,
} from "../../hooks/usePedagogy";
import { useEqSkills } from "../../hooks/useTopics";
import { toast } from "../../stores/toastStore";
import { Select } from "../../components/ui";

const inputClass =
  "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-2.5 text-sm outline-none transition focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";

const STATUS_TABS = [
  { value: "pending", label: "Chờ soát" },
  { value: "ok", label: "Đã ổn" },
  { value: "flagged", label: "Đã gắn cờ" },
  { value: "all", label: "Tất cả" },
];

const STATUS_BADGES = {
  pending: { label: "Chờ soát", className: "bg-surface text-navy/70" },
  ok: { label: "Ổn", className: "bg-secondary-tint text-secondary-dark" },
  flagged: { label: "Đã gắn cờ", className: "bg-danger-tint text-danger-dark" },
};

// Nguồn kỹ năng con của điểm dừng trong truyện "Kể chuyện nhà mình" (story_sub_skills.source)
const FAMILY_SOURCE_LABELS = {
  moment: "từ khoảnh khắc trong chuyện",
  need: "theo nhu cầu của bé",
  parent: "phụ huynh chọn",
};

/** Ngữ cảnh chuyện nhà (tên đã che "Bạn A/B"): chỗ chuyên gia bắt lỗi "AI gán sai kỹ năng". */
function FamilyContext({ family }) {
  const rows = [
    ["Lời kể", family.situation],
    ["Khoảnh khắc", family.momentSummary],
    ["Tình tiết thêm", family.seedEvent],
    ["Nguồn kỹ năng", family.source && (FAMILY_SOURCE_LABELS[family.source] ?? family.source)],
  ].filter(([, v]) => v);
  return (
    <div className="rounded-2xl border border-dashed border-secondary/40 bg-secondary-tint/40 px-4 py-3">
      <p className="mb-1.5 text-xs font-bold tracking-wide text-secondary-dark uppercase">Kể chuyện nhà mình</p>
      <dl className="grid gap-x-3 gap-y-1 text-sm sm:grid-cols-[8rem_1fr]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="font-semibold text-navy/60">{label}</dt>
            <dd className={`text-navy/85 ${label === "Lời kể" ? "line-clamp-3 whitespace-pre-line" : ""}`} title={label === "Lời kể" ? value : undefined}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const REASON_MIN = 5;
const REASON_MAX = 500;

function FlagModal({ item, onClose }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const flag = useFlagCheckpoint();

  const submit = (e) => {
    e.preventDefault();
    const text = reason.trim();
    if (text.length < REASON_MIN) return setError(`Lý do có ít nhất ${REASON_MIN} ký tự`);
    if (text.length > REASON_MAX) return setError(`Lý do tối đa ${REASON_MAX} ký tự`);
    flag.mutate(
      { id: item.checkpointId, reason: text },
      {
        onSuccess: () => {
          toast.success("Đã gắn cờ: câu hỏi không còn tính vào báo cáo EQ");
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
      title="Gắn cờ câu hỏi"
      description="Câu bị gắn cờ không còn tính điểm và không vào báo cáo EQ. Bé vẫn đọc và trả lời bình thường; nội dung truyện không đổi."
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Hủy
          </button>
          <button
            type="submit"
            form="flag-form"
            disabled={flag.isPending}
            className="inline-flex items-center gap-1.5 rounded-full bg-danger px-5 py-2.5 text-sm font-bold text-white transition hover:bg-danger-dark disabled:opacity-70"
          >
            {flag.isPending && <Loader2 size={16} className="animate-spin" />} Gắn cờ
          </button>
        </>
      }
    >
      <form id="flag-form" onSubmit={submit} noValidate className="space-y-3">
        <p className="rounded-2xl bg-surface px-4 py-3 text-sm font-semibold">{item.question}</p>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Lý do</span>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            rows={4}
            maxLength={REASON_MAX}
            autoFocus
            placeholder="VD: Đáp án cảm xúc không khớp với trang trước; phương án Xây dựng chưa rõ ràng..."
            className={`${inputClass} resize-none`}
          />
          <span className="mt-1 block text-right text-xs text-navy/50">
            {reason.trim().length}/{REASON_MAX}
          </span>
        </label>
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      </form>
    </Modal>
  );
}

function ReviewItem({ item, onFlag }) {
  const ok = useMarkCheckpointOk();
  const unflag = useUnflagCheckpoint();
  const busy = ok.isPending || unflag.isPending;
  const badge = STATUS_BADGES[item.status] ?? STATUS_BADGES.pending;

  const markOk = () =>
    ok.mutate(item.checkpointId, {
      onSuccess: () => toast.success(item.status === "flagged" ? "Đã gỡ cờ và đánh dấu ổn" : "Đã đánh dấu ổn"),
      onError: (err) => toast.error(err.message),
    });
  const removeFlag = () =>
    unflag.mutate(item.checkpointId, {
      onSuccess: () => toast.success("Đã gỡ cờ, câu hỏi quay lại hàng chờ soát"),
      onError: (err) => toast.error(err.message),
    });

  return (
    <li className="space-y-3 px-5 py-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`rounded-full px-2.5 py-0.5 font-bold ${badge.className}`}>{badge.label}</span>
        <CaselTag competency={item.skill?.caselCode} short className="bg-secondary-tint" />
        {item.subSkill && <span className="font-semibold text-navy/80">{item.subSkill.nameVi}</span>}
        <span className="text-navy/40">·</span>
        <span className="text-navy/60">{CHECKPOINT_TYPES[item.type]?.short ?? item.type}</span>
        {item.template && (
          <>
            <span className="text-navy/40">·</span>
            <span className="text-navy/60">
              Mẫu “{item.template.title}” v{item.template.version}
            </span>
          </>
        )}
        <span className="ml-auto text-navy/45">{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
      </div>

      {item.family && <FamilyContext family={item.family} />}

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl bg-surface p-4">
          <p className="mb-1 text-xs font-bold tracking-wide text-navy/50 uppercase">Trang ngay trước</p>
          <p className="text-sm whitespace-pre-line text-navy/80">{item.pageBefore || "—"}</p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-bold tracking-wide text-navy/50 uppercase">Câu hỏi</p>
          <p className="font-semibold">{item.question}</p>
          {item.answerEmotion && (
            <p className="text-sm">
              Đáp án cảm xúc: <span className="font-bold text-secondary-dark">{EMOTIONS[item.answerEmotion] ?? item.answerEmotion}</span>
            </p>
          )}
          {item.options.length > 0 && (
            <ul className="space-y-1.5">
              {item.options.map((o, i) => (
                <li key={i} className="flex items-start gap-2 rounded-xl border border-outline px-3 py-2 text-sm">
                  <span className="min-w-0 flex-1">{o.text}</span>
                  {o.role && (
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${OPTION_ROLES[o.role]?.tone ?? "bg-surface"}`}>
                      {OPTION_ROLES[o.role]?.label ?? o.role}
                    </span>
                  )}
                  {o.isCorrect === true && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary-tint px-2 py-0.5 text-xs font-bold text-secondary-dark">
                      <CheckCircle2 size={12} /> Đáp án
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {item.status === "flagged" && item.excludedReason && (
        <p className="rounded-2xl bg-danger-tint px-4 py-2.5 text-sm text-danger-dark">
          <span className="font-bold">Lý do gắn cờ:</span> {item.excludedReason}
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-2">
        {item.status === "flagged" && (
          <button
            type="button"
            onClick={removeFlag}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-sm font-semibold hover:bg-outline disabled:opacity-60"
          >
            {unflag.isPending ? <Loader2 size={15} className="animate-spin" /> : <FlagOff size={15} />} Gỡ cờ
          </button>
        )}
        {item.status !== "flagged" && (
          <button
            type="button"
            onClick={() => onFlag(item)}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full bg-danger-tint px-4 py-2 text-sm font-bold text-danger-dark hover:bg-danger hover:text-white disabled:opacity-60"
          >
            <Flag size={15} /> Gắn cờ
          </button>
        )}
        {item.status !== "ok" && (
          <button type="button" onClick={markOk} disabled={busy} className="btn-primary py-2 text-sm disabled:opacity-60">
            {ok.isPending ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />} Ổn
          </button>
        )}
      </div>
    </li>
  );
}

function StatsTab() {
  const { data: stats = [], isLoading, isError, refetch } = useCheckpointReviewStats();
  if (isLoading) return <div className="m-5 h-32 animate-pulse rounded-2xl bg-surface" />;
  if (isError)
    return (
      <div className="p-8 text-center">
        <p className="font-display font-bold">Không tải được thống kê</p>
        <button onClick={() => refetch()} className="btn-primary mt-4">
          Thử lại
        </button>
      </div>
    );
  if (!stats.length)
    return (
      <div className="flex flex-col items-center gap-2 p-10 text-center">
        <BarChart3 size={36} className="text-primary" />
        <p className="font-display font-bold">Chưa soát câu hỏi nào</p>
        <p className="max-w-md text-sm text-navy/60">Đánh dấu “Ổn” hoặc “Gắn cờ” ở hàng đợi, số liệu theo từng mẫu sẽ hiện ở đây.</p>
      </div>
    );
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-surface text-left text-xs text-navy/60">
          <tr>
            <th className="px-5 py-2.5">Mẫu câu hỏi</th>
            <th className="px-3 py-2.5 text-right">Đã soát</th>
            <th className="px-3 py-2.5 text-right">Bị gắn cờ</th>
            <th className="px-5 py-2.5 text-right">Tỉ lệ cờ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline">
          {stats.map((s) => (
            <tr key={s.templateId}>
              <td className="px-5 py-2.5 font-semibold">{s.title}</td>
              <td className="px-3 py-2.5 text-right">{s.reviewed}</td>
              <td className={`px-3 py-2.5 text-right ${s.flagged ? "font-bold text-danger" : ""}`}>{s.flagged}</td>
              <td className="px-5 py-2.5 text-right text-navy/70">{s.reviewed ? `${Math.round((s.flagged / s.reviewed) * 100)}%` : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-5 py-3 text-xs text-navy/55">Gộp mọi phiên bản của mẫu. Mẫu bị gắn cờ nhiều nên soạn phiên bản mới ở trang Mẫu câu hỏi.</p>
    </div>
  );
}

// Soát câu hỏi AI (spec sư phạm CASEL §8): điểm dừng chấm điểm do AI viết theo mẫu; "Ổn" / "Gắn cờ" (loại khỏi điểm).
// Chỉ hiện tên chung "Bạn A/B…", không có tên thật hay tình huống phụ huynh nhập.
function CheckpointReviewPage() {
  const [tab, setTab] = useState("queue");
  const [status, setStatus] = useState("pending");
  const [skillId, setSkillId] = useState("all");
  const [subSkillId, setSubSkillId] = useState("all");
  const [templateId, setTemplateId] = useState("all");
  const [flagging, setFlagging] = useState(null);

  const { data: skills = [] } = useEqSkills();
  const { data: subSkills = [] } = useSubSkills({ skillId });
  const { data: templates = [] } = useTemplates({ skillId, subSkillId });
  const filters = { status, skillId, subSkillId, templateId };
  const queue = useCheckpointQueue(filters);
  const items = queue.data?.pages.flatMap((p) => p.items) ?? [];

  const changeSkill = (value) => {
    setSkillId(value);
    setSubSkillId("all");
    setTemplateId("all");
  };
  const changeSubSkill = (value) => {
    setSubSkillId(value);
    setTemplateId("all");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
          <ScanSearch size={16} /> Chương trình sư phạm
        </p>
        <h1 className="text-3xl">Soát câu hỏi AI</h1>
        <p className="mt-1 max-w-3xl text-navy/70">
          Câu hỏi chấm điểm do AI viết theo mẫu của chuyên gia, mới nhất trước. “Gắn cờ” loại câu khỏi điểm và báo cáo EQ của bé (bé vẫn đọc bình thường);
          “Ổn” xác nhận câu đạt, đồng thời gỡ cờ nếu có. Tên nhân vật đã đổi thành “Bạn A/B…”.
        </p>
      </div>

      <div className="flex gap-2" role="tablist" aria-label="Chế độ xem">
        {[
          { value: "queue", label: "Hàng đợi" },
          { value: "stats", label: "Thống kê theo mẫu" },
        ].map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => setTab(t.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${tab === t.value ? "bg-primary text-white" : "bg-surface text-navy/70"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "stats" ? (
        <section className="card overflow-hidden">
          <StatsTab />
        </section>
      ) : (
        <>
          <div className="flex flex-col gap-3 rounded-card bg-white p-4 shadow-low lg:flex-row lg:items-center">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Trạng thái">
              {STATUS_TABS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  role="tab"
                  aria-selected={status === t.value}
                  onClick={() => setStatus(t.value)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-bold ${status === t.value ? "bg-secondary text-white" : "bg-surface text-navy/70"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="lg:ml-auto lg:w-52">
              <Select label="Năng lực" value={skillId} onChange={changeSkill} shape="pill" options={[{ value: "all", label: "Mọi năng lực" }, ...skills.map((s) => ({ value: s.id, label: s.nameVi }))]} />
            </div>
            <div className="lg:w-60">
              <Select label="Kỹ năng con" value={subSkillId} onChange={changeSubSkill} shape="pill" options={[{ value: "all", label: "Mọi kỹ năng con" }, ...subSkills.map((s) => ({ value: s.id, label: s.nameVi }))]} />
            </div>
            <div className="lg:w-52">
              <Select label="Mẫu câu hỏi" value={templateId} onChange={setTemplateId} shape="pill" options={[{ value: "all", label: "Mọi mẫu" }, ...templates.map((t) => ({ value: t.id, label: t.title }))]} />
            </div>
          </div>

          <section className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-outline px-5 py-3">
              <h2 className="text-lg">Câu hỏi</h2>
              <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-bold text-navy/70">
                {items.length}
                {queue.hasNextPage ? "+" : ""}
              </span>
              {queue.isFetching && !queue.isLoading && <Loader2 size={16} className="animate-spin text-primary" />}
            </div>

            {queue.isLoading ? (
              <div className="space-y-2 p-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-40 animate-pulse rounded-2xl bg-surface" />
                ))}
              </div>
            ) : queue.isError ? (
              <div className="p-8 text-center">
                <p className="font-display font-bold">Không tải được hàng đợi</p>
                <p className="mt-1 text-sm text-navy/60">{queue.error.message}</p>
                <button onClick={() => queue.refetch()} className="btn-primary mt-4">
                  Thử lại
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 p-10 text-center">
                <SearchX size={36} className="text-primary" />
                <p className="font-display font-bold">{status === "pending" ? "Không còn câu nào chờ soát" : "Không có câu hỏi phù hợp"}</p>
              </div>
            ) : (
              <>
                <ul className="divide-y divide-outline">
                  {items.map((item) => (
                    <ReviewItem key={item.checkpointId} item={item} onFlag={setFlagging} />
                  ))}
                </ul>
                {queue.hasNextPage && (
                  <div className="border-t border-outline p-4 text-center">
                    <button
                      type="button"
                      onClick={() => queue.fetchNextPage()}
                      disabled={queue.isFetchingNextPage}
                      className="inline-flex items-center gap-1.5 rounded-full bg-surface px-5 py-2 text-sm font-semibold hover:bg-outline disabled:opacity-60"
                    >
                      {queue.isFetchingNextPage && <Loader2 size={15} className="animate-spin" />} Xem thêm
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </>
      )}

      {flagging && <FlagModal item={flagging} onClose={() => setFlagging(null)} />}
    </div>
  );
}

export default CheckpointReviewPage;
