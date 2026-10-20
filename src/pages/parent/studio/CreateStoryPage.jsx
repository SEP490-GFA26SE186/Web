import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, Check, Loader2, PenLine, Plus, Sparkles, Star } from "lucide-react";
import Modal from "../../../components/common/Modal";
import Switch from "../../../components/common/Switch";
import CaselTag from "../../../components/parent/library/CaselTag";
import { fieldClass } from "../../../components/parent/studio/PageEditor";
import { AI_LENGTHS } from "../../../constants/story";
import { ROUTES } from "../../../constants/routes";
import { refreshCredit, useAiPricing, useCreateCharacter, useCharacters, useCreateStory } from "../../../hooks/useStudio";
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

function CreateStoryPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const creditBalance = useAuthStore((s) => s.user?.wallet?.creditBalance);
  const topics = useTopics({});
  const characters = useCharacters();
  const createStory = useCreateStory();
  const pricing = useAiPricing();
  const priceOf = (len) => pricing.data?.lengths?.find((p) => p.length === len);

  const [topicId, setTopicId] = useState(null);
  const [selected, setSelected] = useState([]); // characterId theo thứ tự chọn
  const [mainId, setMainId] = useState(null);
  const [mode, setMode] = useState("ai");
  const [length, setLength] = useState("medium");
  const [title, setTitle] = useState("");
  const [situation, setSituation] = useState("");
  const [useTts, setUseTts] = useState(true);
  const [useAiImage, setUseAiImage] = useState(false);
  const [showNewCharacter, setShowNewCharacter] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toggleCharacter = (id) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
    setSelected(next);
    // Nhân vật chính bị bỏ chọn (hoặc chưa có) → lấy nhân vật đầu tiên còn lại
    if (!next.includes(mainId)) setMainId(next[0] ?? null);
  };

  // Giá của lần AI viết này (theo độ dài đang chọn) và credit còn lại sau khi viết
  const cost = mode === "ai" ? priceOf(length)?.credits : 0;
  const afterCost = creditBalance != null && cost != null ? creditBalance - cost : null;
  const notEnough = mode === "ai" && afterCost != null && afterCost < 0;

  // Tranh AI (chỉ truyện AI viết): tối đa `maxScenes` cảnh + chân dung còn thiếu của nhân vật đã chọn.
  // Trừ dần khi vẽ (sau khi AI viết xong chữ); thiếu credit thì truyện vẫn viết, chỉ vẽ được đến đâu hay đến đó.
  const imageCosts = pricing.data?.images;
  const missingPortraits = (characters.data ?? []).filter(
    (c) => selected.includes(c.id) && !c.portraitImageUrl && c.portraitStatus === "none",
  ).length;
  const imagesMax =
    mode === "ai" && useAiImage && imageCosts ? imageCosts.maxScenes * imageCosts.scene + missingPortraits * imageCosts.characterPortrait : 0;

  const missing =
    (mode === "ai" && !topicId && "Ba mẹ chọn một bài học nhé") ||
    (selected.length === 0 && "Ba mẹ chọn ít nhất một nhân vật nhé") ||
    (!title.trim() && "Ba mẹ đặt tên cho truyện nhé") ||
    (notEnough && `Truyện này cần ${cost} credit, ba mẹ còn ${creditBalance} credit`) ||
    "";

  const submit = async () => {
    if (missing) return setError(missing);
    setError("");
    setSubmitting(true);
    // Nhân vật chính đứng đầu → token {NV1}; thứ tự còn lại theo lúc chọn
    const ordered = [mainId, ...selected.filter((id) => id !== mainId)];
    try {
      const story = await createStory.mutateAsync({
        // Truyện tự viết có thể không gắn bài học
        ...(topicId && { topicId }),
        length: mode === "ai" ? length : "custom",
        title: title.trim(),
        ...(situation.trim() && { situation: situation.trim() }),
        characters: ordered.map((characterId) => ({ characterId, isMain: characterId === mainId })),
        useAiImage: mode === "ai" && useAiImage,
        useTts,
      });
      if (mode === "ai") {
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
      setError(err.errors?.[0]?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-10">
      <Link to={ROUTES.PARENT.STUDIO} className="inline-flex items-center gap-1 text-sm font-semibold text-navy/60 hover:text-primary">
        <ArrowLeft size={16} /> Truyện của ba mẹ
      </Link>
      <h1 className="text-3xl">Sáng tác truyện mới</h1>

      <Section
        step={1}
        title="Chọn bài học"
        hint={
          mode === "ai"
            ? "Bài học do chuyên gia soạn, mỗi bài gắn một năng lực cảm xúc (CASEL)."
            : "Truyện tự viết không bắt buộc chọn bài học."
        }
      >
        {mode !== "ai" && (
          <>
            <button
              type="button"
              onClick={() => setTopicId(null)}
              aria-pressed={!topicId}
              className={`rounded-full px-4 py-2 text-sm font-bold ${!topicId ? "bg-secondary text-white" : "bg-surface hover:bg-secondary-tint"}`}
            >
              Không chọn bài học
            </button>
            <p className="text-sm text-navy/60">Truyện tự viết không tính vào báo cáo EQ.</p>
          </>
        )}
        {topics.isLoading && <Loader2 className="animate-spin text-primary" />}
        {topics.error && <p className="text-sm text-danger">{topics.error.message}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          {(topics.data ?? []).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTopicId(t.id)}
              aria-pressed={topicId === t.id}
              aria-label={`Bài học: ${t.title}`}
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

      <Section step={3} title="Cách viết truyện">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { value: "ai", icon: Bot, title: "AI viết giúp", text: "AI viết cả truyện một lần, ba mẹ xem và sửa lại." },
            { value: "manual", icon: PenLine, title: "Tự viết", text: "Ba mẹ tự viết từng trang và điểm dừng (4–20 trang)." },
          ].map(({ value, icon: Icon, title: label, text }) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              aria-pressed={mode === value}
              aria-label={label}
              className={`flex flex-col justify-start gap-1 rounded-2xl border-2 p-4 text-left transition ${mode === value ? "border-primary bg-primary-tint" : "border-outline hover:border-primary/50"}`}
            >
              <p className="flex items-center gap-2 font-display font-bold">
                <Icon size={18} /> {label}
              </p>
              <p className="text-sm text-navy/60">{text}</p>
            </button>
          ))}
        </div>
        {mode === "ai" && (
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
        )}
      </Section>

      <Section step={4} title="Thông tin truyện">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Tên truyện</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} className={fieldClass} placeholder="VD: Bin và chú khủng long xanh" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Chuyện thật ở nhà (không bắt buộc)</span>
          <textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            maxLength={2000}
            rows={4}
            className={fieldClass}
            placeholder="VD: Bin giật đồ chơi của em, em ngã và khóc to, Bin hét lên rồi ném đồ chơi."
          />
          <span className="mt-1 block text-xs text-navy/55">
            Ba mẹ cứ dùng tên thật — hệ thống đổi tên thành ký hiệu trước khi gửi cho AI. AI giữ diễn biến chính của chuyện.
          </span>
        </label>
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface p-4">
          <div>
            <p className="font-semibold">Giọng đọc kể truyện</p>
            <p className="text-xs text-navy/55">Đọc cả lời kể, câu hỏi, gợi ý và phản hồi cho bé</p>
          </div>
          <Switch checked={useTts} onChange={setUseTts} label="Giọng đọc kể truyện" />
        </div>
        <div className={`flex items-center justify-between gap-3 rounded-2xl bg-surface p-4 ${mode === "ai" ? "" : "opacity-60"}`}>
          <div>
            <p className="font-semibold">Tranh minh họa bằng AI</p>
            <p className="text-xs text-navy/55">
              {mode !== "ai"
                ? "Hiện chỉ dành cho truyện AI viết"
                : imageCosts
                  ? `AI vẽ ${imageCosts.maxScenes > 1 ? `tối đa ${imageCosts.maxScenes} cảnh` : "cảnh"} (${imageCosts.scene} credit/cảnh)${
                      missingPortraits ? ` + ${missingPortraits} chân dung còn thiếu (${imageCosts.characterPortrait} credit/chân dung)` : ""
                    }, vẽ sau khi chữ xong`
                  : "AI vẽ tranh cho từng cảnh sau khi viết xong chữ"}
            </p>
          </div>
          <Switch checked={mode === "ai" && useAiImage} onChange={setUseAiImage} label="Tranh minh họa bằng AI" disabled={mode !== "ai"} />
        </div>
      </Section>

      <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="min-w-0 flex-1 text-sm text-navy/65">
          {mode !== "ai" ? (
            "Truyện tự viết không dùng credit và không tính vào báo cáo EQ."
          ) : cost == null ? (
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
          )}
        </div>
        <button type="button" onClick={submit} disabled={submitting || notEnough} className="btn-primary disabled:opacity-60">
          {submitting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {mode === "ai" ? "Tạo & cho AI viết" : "Tạo truyện"}
        </button>
        {error && <p className="w-full text-sm font-semibold text-danger">{error}</p>}
      </div>

      <NewCharacterModal
        open={showNewCharacter}
        onClose={() => setShowNewCharacter(false)}
        onCreated={(character) => {
          setShowNewCharacter(false);
          toggleCharacter(character.id);
          toast.success(`Đã thêm ${character.name}`);
        }}
      />
    </div>
  );
}

export default CreateStoryPage;
