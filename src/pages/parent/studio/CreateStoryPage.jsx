import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, BookMarked, BookOpen, Check, House, Lightbulb, Loader2, PenLine, Plus, Shuffle, Sparkles, Star } from "lucide-react";
import Modal from "../../../components/common/Modal";
import Switch from "../../../components/common/Switch";
import CaselTag from "../../../components/parent/library/CaselTag";
import { fieldClass } from "../../../components/parent/studio/PageEditor";
import SubSkillPicker from "../../../components/parent/studio/SubSkillPicker";
import { AI_LENGTHS } from "../../../constants/story";
import { ROUTES } from "../../../constants/routes";
import { refreshCredit, useAiPricing, useCreateCharacter, useCharacters, useCreateStory, useAnalyzeStory } from "../../../hooks/useStudio";
import { useTopics } from "../../../hooks/useTopics";
import { generateStory } from "../../../services/storyService";
import useAuthStore from "../../../stores/authStore";
import { toast } from "../../../stores/toastStore";

function Section({ step, title, hint, children }) {
  return (
    <section className="card space-y-4 p-6">
      <div>
        <h2 className="flex items-center gap-2 text-lg">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-sm text-white">{step}</span>
          {title}
        </h2>
        {hint && <p className="mt-1 text-sm text-navy/60">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function NewCharacterModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", appearance: "" });
  const create = useCreateCharacter();
  const submit = (e) => {
    e.preventDefault();
    create.mutate(
      { name: form.name.trim(), appearance: form.appearance.trim() },
      {
        onSuccess: (character) => {
          setForm({ name: "", appearance: "" });
          onCreated(character);
        },
      },
    );
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Thêm nhân vật gia đình"
      description="Ông bà, anh chị em, bạn bè… Tên thật không gửi cho AI, chỉ mô tả ngoại hình."
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Hủy
          </button>
          <button
            type="submit"
            form="character-form"
            disabled={create.isPending || !form.name.trim() || !form.appearance.trim()}
            className="btn-primary py-2.5 text-sm disabled:opacity-60"
          >
            {create.isPending && <Loader2 size={16} className="animate-spin" />} Thêm nhân vật
          </button>
        </>
      }
    >
      <form id="character-form" onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Tên gọi</span>
          <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={fieldClass} placeholder="VD: Bà nội" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Ngoại hình</span>
          <textarea
            value={form.appearance}
            onChange={(e) => setForm((f) => ({ ...f, appearance: e.target.value }))}
            rows={3}
            className={fieldClass}
            placeholder="VD: Tóc bạc búi gọn, đeo kính, hay mặc áo bà ba nâu"
          />
        </label>
        {create.error && <p className="text-sm font-semibold text-danger">{create.error.message}</p>}
      </form>
    </Modal>
  );
}

const SITUATION_MIN = 20;
const SITUATION_MAX = 2000;

// Ba lối vào (spec 2026-10-22 §3): "Kể chuyện nhà mình" đặt đầu tiên
const ENTRIES = [
  {
    value: "family",
    icon: House,
    title: "Kể chuyện nhà mình",
    text: "Ba mẹ kể chuyện bé vừa gặp, AI tìm khoảnh khắc khó và viết truyện để bé tập lại đúng lúc đó.",
    note: "Có báo cáo EQ (tắt được)",
  },
  {
    value: "topic",
    icon: BookMarked,
    title: "Chuyện mẫu",
    text: "Chọn chuyện chuyên gia soạn sẵn, mỗi chuyện giúp bé tập một năng lực cảm xúc (CASEL).",
    note: "Có báo cáo EQ",
  },
  {
    value: "manual",
    icon: PenLine,
    title: "Tự viết",
    text: "Ba mẹ tự viết từng trang và điểm dừng (4–20 trang).",
    note: "Không tính vào báo cáo EQ",
  },
];

// Kỹ năng đến từ đâu (story_sub_skills.source)
const SKILL_SOURCE = {
  moment: "từ khoảnh khắc trong chuyện",
  need: "bé đang cần tập",
  parent: "ba mẹ chọn",
};

/** Lỗi phân tích / tạo truyện "Kể chuyện nhà mình" → lời tiếng Việt (502: AI lỗi; 429: quá lượt trong ngày). */
const familyError = (err) => {
  if (err.status === 502 || err.status >= 500) return "Chưa phân tích được, ba mẹ thử lại nhé";
  if (err.status === 429) return err.message || "Hôm nay ba mẹ đã phân tích nhiều lần rồi, mai thử lại nhé";
  return err.errors?.[0]?.message || err.message;
};

function CreateStoryPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const creditBalance = useAuthStore((s) => s.user?.wallet?.creditBalance);
  const topics = useTopics({});
  const characters = useCharacters();
  const createStory = useCreateStory();
  const analyze = useAnalyzeStory();
  const pricing = useAiPricing();
  const priceOf = (len) => pricing.data?.lengths?.find((p) => p.length === len);

  // ?topicId= từ "Chuyện mẫu nên đọc tiếp" của Báo cáo EQ → mở thẳng lối vào Chuyện mẫu, chọn sẵn chuyện
  const [searchParams] = useSearchParams();
  const suggestedTopicId = searchParams.get("topicId");
  const [entry, setEntry] = useState(suggestedTopicId ? "topic" : null);
  const [topicId, setTopicId] = useState(suggestedTopicId);
  const [selected, setSelected] = useState([]); // characterId theo thứ tự chọn
  const [mainId, setMainId] = useState(null);
  const [length, setLength] = useState("medium");
  const [title, setTitle] = useState("");
  const [situation, setSituation] = useState("");
  const [useTts, setUseTts] = useState(true);
  const [useAiImage, setUseAiImage] = useState(false);
  const [analysis, setAnalysis] = useState(null); // kết quả POST /stories/analyze (màn xác nhận)
  const [picking, setPicking] = useState(false);
  const [showNewCharacter, setShowNewCharacter] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isAi = entry === "family" || entry === "topic";

  const toggleCharacter = (id) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    setSelected(next);
    // Nhân vật chính bị bỏ chọn (hoặc chưa có) → lấy nhân vật đầu tiên còn lại
    if (!next.includes(mainId)) setMainId(next[0] ?? null);
  };

  // Giá của lần AI viết này (theo độ dài đang chọn) và credit còn lại sau khi viết
  const cost = isAi ? priceOf(length)?.credits : 0;
  const afterCost = creditBalance != null && cost != null ? creditBalance - cost : null;
  const notEnough = isAi && afterCost != null && afterCost < 0;

  // Tranh AI (chỉ truyện AI viết): tối đa `maxScenes` cảnh + chân dung còn thiếu của nhân vật đã chọn.
  // Trừ dần khi vẽ (sau khi AI viết xong chữ); thiếu credit thì truyện vẫn viết, chỉ vẽ được đến đâu hay đến đó.
  const imageCosts = pricing.data?.images;
  const missingPortraits = (characters.data ?? []).filter(
    (c) => selected.includes(c.id) && !c.portraitImageUrl && c.portraitStatus === "none",
  ).length;
  const imagesMax = isAi && useAiImage && imageCosts ? imageCosts.maxScenes * imageCosts.scene + missingPortraits * imageCosts.characterPortrait : 0;

  // topicId lấy từ URL có thể là chuyện mẫu đã tắt → chỉ coi là đã chọn khi có trong danh sách
  const chosenTopicId = (topics.data ?? []).some((t) => t.id === topicId) ? topicId : null;
  const situationLength = situation.trim().length;
  const missing =
    (entry === "topic" && !chosenTopicId && "Ba mẹ chọn một chuyện mẫu nhé") ||
    (entry === "family" && situationLength < SITUATION_MIN && `Ba mẹ kể chuyện dài thêm một chút nhé (ít nhất ${SITUATION_MIN} ký tự)`) ||
    (entry === "family" && situationLength > SITUATION_MAX && `Lời kể tối đa ${SITUATION_MAX} ký tự`) ||
    (selected.length === 0 && "Ba mẹ chọn ít nhất một nhân vật nhé") ||
    (!title.trim() && "Ba mẹ đặt tên cho truyện nhé") ||
    (notEnough && `Truyện này cần ${cost} credit, ba mẹ còn ${creditBalance} credit`) ||
    "";

  // Nhân vật chính đứng đầu → token {NV1}; thứ tự còn lại theo lúc chọn. Analyze và tạo truyện phải gửi giống nhau.
  const orderedCharacters = () =>
    [mainId, ...selected.filter((id) => id !== mainId)].map((characterId) => ({ characterId, isMain: characterId === mainId }));
  const mainName = (characters.data ?? []).find((c) => c.id === mainId)?.name ?? "bé";

  const pickEntry = (value) => {
    setEntry(value);
    setAnalysis(null);
    setError("");
    if (value === "manual") setUseAiImage(false);
  };

  const runAnalyze = async (subSkillIds) => {
    if (missing) return setError(missing);
    setError("");
    try {
      const result = await analyze.mutateAsync({
        situation: situation.trim(),
        characters: orderedCharacters(),
        length,
        ...(subSkillIds?.length && { subSkillIds }),
      });
      setAnalysis(result);
    } catch (err) {
      setError(familyError(err));
    } finally {
      setPicking(false);
    }
  };

  /** Tạo truyện rồi (truyện AI) cho AI viết ngay; xong mở trình sửa truyện. */
  const createAndOpen = async (payload, ai) => {
    setError("");
    setSubmitting(true);
    try {
      const story = await createStory.mutateAsync(payload);
      if (ai) {
        try {
          await generateStory(story.id);
          refreshCredit(queryClient); // credit vừa bị giữ
          if (cost > 0) toast.success(`Đã dùng ${cost} credit — AI đang viết truyện`);
        } catch (err) {
          // Truyện đã tạo; báo lỗi rồi để trang editor cho bấm "Cho AI viết" lại
          toast.error(err.status === 402 ? "Ba mẹ không đủ credit để AI viết truyện" : err.message);
        }
      }
      navigate(ROUTES.PARENT.studioStory(story.id));
    } catch (err) {
      setError(entry === "family" ? familyError(err) : err.errors?.[0]?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const base = () => ({ title: title.trim(), characters: orderedCharacters(), useTts });

  const submit = () => {
    if (missing) return setError(missing);
    if (entry === "topic") return createAndOpen({ entry: "topic", topicId: chosenTopicId, length, ...base(), useAiImage }, true);
    // Tự viết có thể không gắn chuyện mẫu; BE đặt entry = handwritten
    return createAndOpen({ ...(chosenTopicId && { topicId: chosenTopicId }), length: "custom", ...base(), useAiImage: false }, false);
  };

  const createFamily = (scored) => {
    if (notEnough) return setError(`Truyện này cần ${cost} credit, ba mẹ còn ${creditBalance} credit`);
    if (analysis.expiresAt && new Date(analysis.expiresAt) <= new Date()) {
      setAnalysis(null);
      return setError("Bản phân tích đã hết hạn, ba mẹ bấm “Xem bé sẽ tập gì” lại nhé");
    }
    createAndOpen(
      {
        entry: "family",
        length,
        ...base(),
        situation: situation.trim(),
        analysisToken: analysis.analysisToken,
        scored,
        useAiImage,
      },
      true,
    );
  };

  const entryMeta = ENTRIES.find((e) => e.value === entry);
  const EntryIcon = entryMeta?.icon;
  const busy = submitting || analyze.isPending;
  const sortedSkills = [...(analysis?.subSkills ?? [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

  const costNote =
    cost == null ? (
      "Đang tải giá…"
    ) : notEnough ? (
      <p className="font-semibold text-danger">
        Truyện {priceOf(length) ? `${priceOf(length).pages} trang` : "này"} cần {cost} credit, ba mẹ còn {creditBalance} credit. Chọn độ dài ngắn hơn hoặc{" "}
        <Link to={ROUTES.PARENT.BILLING} className="underline">nâng gói</Link>.
      </p>
    ) : cost === 0 ? (
      "Lần viết này miễn phí."
    ) : (
      <p>
        AI viết truyện này dùng <span className="font-bold text-navy">{cost} credit</span>
        {afterCost != null && (
          <>
            {" "}— ba mẹ đang có {creditBalance}, còn <span className="font-bold text-navy">{afterCost}</span> sau khi viết
          </>
        )}
        . Nếu AI viết lỗi, credit được hoàn lại.
        {imagesMax > 0 && (
          <span className="mt-1 block">
            Tranh dùng thêm <span className="font-bold text-navy">tối đa {imagesMax} credit</span>, trừ dần khi vẽ từng cảnh
            {afterCost != null && afterCost < imagesMax ? " — không đủ thì truyện vẫn viết, tranh vẽ được đến đâu hay đến đó" : ""}.
          </span>
        )}
      </p>
    );

  const topicSection = (
    <Section
      step={1}
      title={entry === "topic" ? "Chọn chuyện mẫu" : "Chọn chuyện mẫu (không bắt buộc)"}
      hint={entry === "topic" ? "Chuyện mẫu do chuyên gia soạn, mỗi chuyện gắn một năng lực cảm xúc (CASEL)." : "Truyện tự viết không bắt buộc chọn chuyện mẫu."}
    >
      {entry !== "topic" && (
        <>
          <button
            type="button"
            onClick={() => setTopicId(null)}
            aria-pressed={!topicId}
            className={`rounded-full px-4 py-2 text-sm font-bold ${!topicId ? "bg-secondary text-white" : "bg-surface hover:bg-secondary-tint"}`}
          >
            Không chọn chuyện mẫu
          </button>
          <p className="text-sm text-navy/60">Truyện tự viết không tính vào báo cáo EQ.</p>
        </>
      )}
      {topics.isLoading && <Loader2 className="animate-spin text-primary" />}
      {topics.error && <p className="text-sm text-danger">{topics.error.message}</p>}
      {suggestedTopicId && topics.data && (
        <p className="rounded-2xl bg-secondary-tint px-4 py-2.5 text-sm text-secondary-dark">
          {topics.data.some((t) => t.id === suggestedTopicId)
            ? "Đã chọn sẵn chuyện mẫu gợi ý từ Báo cáo EQ. Ba mẹ có thể đổi chuyện khác."
            : "Chuyện mẫu gợi ý không còn mở, ba mẹ chọn chuyện khác nhé."}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {(topics.data ?? []).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTopicId(t.id)}
            aria-pressed={topicId === t.id}
            aria-label={`Chuyện mẫu: ${t.title}`}
            className={`flex flex-col items-start justify-start gap-2 rounded-2xl border-2 p-4 text-left transition ${
              topicId === t.id ? "border-primary bg-primary-tint" : "border-outline hover:border-primary/50"
            }`}
          >
            <CaselTag competency={t.skill?.caselCode} className="bg-secondary-tint" />
            <p className="font-display font-bold">{t.title}</p>
            <p className="text-xs text-navy/55">
              {t.ageMin}–{t.ageMax} tuổi
            </p>
          </button>
        ))}
      </div>
    </Section>
  );

  const situationSection = (
    <Section step={1} title="Kể chuyện của bé" hint="Chuyện vừa xảy ra ở nhà, ở lớp… Càng cụ thể (ai, làm gì, bé phản ứng ra sao) truyện càng giống chuyện thật.">
      <label className="block">
        <span className="sr-only">Lời kể</span>
        <textarea
          value={situation}
          onChange={(e) => {
            setSituation(e.target.value);
            setError("");
          }}
          maxLength={SITUATION_MAX}
          rows={5}
          disabled={analyze.isPending}
          className={fieldClass}
          placeholder="VD: Bin đang xếp lego thì em Na làm đổ, Bin hét lên và đẩy em ngã."
        />
        <span className="mt-1 flex justify-between gap-3 text-xs text-navy/55">
          <span>Ba mẹ cứ dùng tên thật — hệ thống đổi tên thành ký hiệu trước khi gửi cho AI.</span>
          <span className={situationLength > 0 && situationLength < SITUATION_MIN ? "font-semibold text-danger" : ""}>
            {situationLength}/{SITUATION_MAX}
          </span>
        </span>
      </label>
    </Section>
  );

  const confirmView = analysis && (
    <section className="card space-y-5 p-6" aria-live="polite">
      <div>
        <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-secondary-dark">
          <Sparkles size={16} /> Bé sẽ tập gì
        </p>
        <h2 className="text-xl">Ba mẹ xem lại trước khi tạo truyện</h2>
      </div>
      <dl className="space-y-4">
        <div>
          <dt className="font-display font-bold">Truyện của {mainName}:</dt>
          <dd className={`mt-0.5 text-navy/80 ${analysis.momentSummary ? "" : "line-clamp-3 whitespace-pre-line"}`}>
            {analysis.momentSummary ?? situation.trim()}
          </dd>
        </div>
        <div>
          <dt className="font-display font-bold">{mainName} sẽ tập:</dt>
          <dd className="mt-1.5">
            <ul className="space-y-2">
              {sortedSkills.map((s) => (
                <li key={s.id} className="rounded-2xl bg-surface px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <CaselTag competency={s.skill?.caselCode} short className="bg-secondary-tint" />
                    <span className="font-semibold">{s.nameVi}</span>
                    {SKILL_SOURCE[s.source] && <span className="text-xs text-navy/50">· {SKILL_SOURCE[s.source]}</span>}
                  </div>
                  {s.descriptionVi && <p className="mt-1 text-sm text-navy/65">{s.descriptionVi}</p>}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        {analysis.seedEvent && (
          <div className="rounded-2xl bg-primary-tint px-4 py-3">
            <dt className="font-display font-bold">Truyện sẽ thêm:</dt>
            <dd className="mt-0.5">{analysis.seedEvent}</dd>
            <dd className="mt-1 text-xs text-navy/60">
              AI thêm tình tiết nhỏ này để bé có dịp tập kỹ năng. Phần còn lại giữ đúng chuyện ba mẹ kể.
            </dd>
          </div>
        )}
      </dl>

      <div className="text-sm text-navy/65">{costNote}</div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => createFamily(true)} disabled={busy || notEnough} className="btn-primary disabled:opacity-60">
          {submitting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />} Tạo truyện
        </button>
        <button
          type="button"
          onClick={() => setPicking(true)}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-secondary-tint px-5 py-2.5 text-sm font-bold text-secondary-dark hover:opacity-80 disabled:opacity-60"
        >
          <Shuffle size={16} /> Đổi kỹ năng
        </button>
        <button
          type="button"
          onClick={() => createFamily(false)}
          disabled={busy || notEnough}
          className="inline-flex items-center gap-1.5 rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline disabled:opacity-60"
        >
          <BookOpen size={16} /> Chỉ kể truyện, không chấm điểm
        </button>
        <button
          type="button"
          onClick={() => {
            setAnalysis(null);
            setError("");
          }}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline disabled:opacity-60"
        >
          <PenLine size={16} /> Sửa lời kể
        </button>
      </div>
      <p className="text-xs text-navy/55">
        “Chỉ kể truyện”: truyện vẫn bám chuyện ba mẹ kể nhưng không có câu hỏi chấm điểm, chỉ có câu suy ngẫm cuối truyện. Credit chỉ bị trừ khi ba mẹ tạo truyện.
      </p>
      {analyze.isPending && (
        <p className="flex items-center gap-2 text-sm font-semibold text-secondary-dark">
          <Loader2 size={16} className="animate-spin" /> Đang đọc lại chuyện với kỹ năng ba mẹ chọn… (thường 10–30 giây)
        </p>
      )}
      {error && <p className="text-sm font-semibold text-danger">{error}</p>}
    </section>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-10">
      <Link to={ROUTES.PARENT.STUDIO} className="inline-flex items-center gap-1 text-sm font-semibold text-navy/60 hover:text-primary">
        <ArrowLeft size={16} /> Truyện của ba mẹ
      </Link>
      <h1 className="text-3xl">Sáng tác truyện mới</h1>

      {!entry ? (
        <section className="card space-y-4 p-6">
          <h2 className="text-lg">Ba mẹ muốn bắt đầu thế nào?</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {ENTRIES.map(({ value, icon: Icon, title: label, text, note }) => (
              <button
                key={value}
                type="button"
                onClick={() => pickEntry(value)}
                aria-label={label}
                className="flex flex-col justify-start gap-2 rounded-2xl border-2 border-outline p-4 text-left transition hover:border-primary hover:bg-primary-tint/40"
              >
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary-tint text-primary-dark">
                  <Icon size={20} />
                </span>
                <p className="font-display font-bold">{label}</p>
                <p className="text-sm text-navy/60">{text}</p>
                <p className="mt-auto text-xs font-semibold text-secondary-dark">{note}</p>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="tag-theme">
              {EntryIcon && <EntryIcon size={12} />} {entryMeta?.title}
            </span>
            <button type="button" onClick={() => pickEntry(null)} disabled={busy} className="font-semibold text-primary hover:underline disabled:opacity-60">
              Đổi cách tạo truyện
            </button>
          </div>

          {entry === "family" && analysis ? (
            confirmView
          ) : (
            <>
              {entry === "family" ? situationSection : topicSection}

              <Section step={2} title="Chọn nhân vật" hint="Chọn các nhân vật xuất hiện trong truyện và một nhân vật chính (thường là bé).">
                {characters.isLoading && <Loader2 className="animate-spin text-primary" />}
                <div className="grid gap-3 sm:grid-cols-2">
                  {(characters.data ?? []).map((c) => {
                    const on = selected.includes(c.id);
                    return (
                      <div
                        key={c.id}
                        className={`flex items-start gap-3 rounded-2xl border-2 p-3 transition ${on ? "border-secondary bg-secondary-tint/60" : "border-outline"}`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleCharacter(c.id)}
                          aria-pressed={on}
                          aria-label={`Chọn ${c.name}`}
                          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 ${on ? "border-secondary bg-secondary text-white" : "border-outline"}`}
                        >
                          {on && <Check size={14} />}
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold">
                            {c.name} {c.childId && <span className="text-xs font-semibold text-secondary-dark">(con)</span>}
                          </p>
                          <p className="line-clamp-2 text-xs text-navy/55">{c.appearance}</p>
                        </div>
                        {on && (
                          <button
                            type="button"
                            onClick={() => setMainId(c.id)}
                            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                              mainId === c.id ? "bg-primary text-white" : "bg-surface text-navy/60 hover:bg-primary-tint"
                            }`}
                          >
                            <Star size={12} /> {mainId === c.id ? "Nhân vật chính" : "Đặt làm chính"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setShowNewCharacter(true)}
                    className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline p-3 font-semibold text-navy/60 hover:border-primary hover:text-primary"
                  >
                    <Plus size={18} /> Thêm nhân vật
                  </button>
                </div>
              </Section>

              {isAi && (
                <Section step={3} title="Độ dài truyện" hint="AI viết cả truyện một lần, ba mẹ xem và sửa lại.">
                  <div className="flex flex-wrap gap-2">
                    {AI_LENGTHS.map((l) => (
                      <button
                        key={l.value}
                        type="button"
                        onClick={() => setLength(l.value)}
                        aria-pressed={length === l.value}
                        className={`rounded-full px-4 py-2 text-sm font-bold ${length === l.value ? "bg-secondary text-white" : "bg-surface hover:bg-secondary-tint"}`}
                      >
                        {l.label} · {priceOf(l.value)?.pages ?? l.pages} trang
                        {priceOf(l.value)?.credits != null && <span className="ml-1 opacity-80">· {priceOf(l.value).credits} credit</span>}
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              <Section step={isAi ? 4 : 3} title="Thông tin truyện">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">Tên truyện</span>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} className={fieldClass} placeholder="VD: Bin và chú khủng long xanh" />
                </label>
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface p-4">
                  <div>
                    <p className="font-semibold">Giọng đọc kể truyện</p>
                    <p className="text-xs text-navy/55">Đọc cả lời kể, câu hỏi, gợi ý và phản hồi cho bé</p>
                  </div>
                  <Switch checked={useTts} onChange={setUseTts} label="Giọng đọc kể truyện" />
                </div>
                <div className={`flex items-center justify-between gap-3 rounded-2xl bg-surface p-4 ${isAi ? "" : "opacity-60"}`}>
                  <div>
                    <p className="font-semibold">Tranh minh họa bằng AI</p>
                    <p className="text-xs text-navy/55">
                      {!isAi
                        ? "Hiện chỉ dành cho truyện AI viết"
                        : imageCosts
                          ? `AI vẽ ${imageCosts.maxScenes > 1 ? `tối đa ${imageCosts.maxScenes} cảnh` : "cảnh"} (${imageCosts.scene} credit/cảnh)${
                              missingPortraits ? ` + ${missingPortraits} chân dung còn thiếu (${imageCosts.characterPortrait} credit/chân dung)` : ""
                            }, vẽ sau khi chữ xong`
                          : "AI vẽ tranh cho từng cảnh sau khi viết xong chữ"}
                    </p>
                  </div>
                  <Switch checked={isAi && useAiImage} onChange={setUseAiImage} label="Tranh minh họa bằng AI" disabled={!isAi} />
                </div>
              </Section>

              <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
                <div className="min-w-0 flex-1 text-sm text-navy/65">
                  {!isAi ? (
                    "Truyện tự viết không dùng credit và không tính vào báo cáo EQ."
                  ) : entry === "family" ? (
                    <>
                      {costNote}
                      <p className="mt-1">Bước tiếp theo chỉ đọc chuyện để xem bé sẽ tập gì — chưa trừ credit.</p>
                    </>
                  ) : (
                    costNote
                  )}
                </div>
                {entry === "family" ? (
                  <button type="button" onClick={() => runAnalyze()} disabled={busy} className="btn-primary disabled:opacity-60">
                    {analyze.isPending ? <Loader2 size={18} className="animate-spin" /> : <Lightbulb size={18} />} Xem bé sẽ tập gì
                  </button>
                ) : (
                  <button type="button" onClick={submit} disabled={busy || notEnough} className="btn-primary disabled:opacity-60">
                    {submitting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    {isAi ? "Tạo & cho AI viết" : "Tạo truyện"}
                  </button>
                )}
                {analyze.isPending && (
                  <p className="flex w-full items-center gap-2 rounded-2xl bg-secondary-tint px-4 py-2.5 text-sm font-semibold text-secondary-dark">
                    <Loader2 size={16} className="animate-spin" /> Đang đọc chuyện của ba mẹ để tìm khoảnh khắc cho bé tập… thường mất 10–30 giây.
                  </p>
                )}
                {error && <p className="w-full text-sm font-semibold text-danger">{error}</p>}
              </div>
            </>
          )}
        </>
      )}

      <NewCharacterModal
        open={showNewCharacter}
        onClose={() => setShowNewCharacter(false)}
        onCreated={(character) => {
          setShowNewCharacter(false);
          toggleCharacter(character.id);
          toast.success(`Đã thêm ${character.name}`);
        }}
      />
      {picking && (
        <SubSkillPicker
          initial={sortedSkills.map((s) => s.id)}
          busy={analyze.isPending}
          onClose={() => !analyze.isPending && setPicking(false)}
          onConfirm={(ids) => runAnalyze(ids)}
        />
      )}
    </div>
  );
}

export default CreateStoryPage;
