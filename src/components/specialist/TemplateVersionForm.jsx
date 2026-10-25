import { useState } from "react";
import { ChevronDown, ChevronRight, Eye, Loader2, Plus, X } from "lucide-react";
import Modal from "../common/Modal";
import { CASEL_URL } from "../../constants/casel";
import { ANSWER_FORMATS, EMOTIONS, OPTION_ROLES, SUGGESTED_FORMATS } from "../../constants/story";
import { useCreateTemplate, usePublishTemplate, useSaveTemplateDraft, useUpdateTemplate } from "../../hooks/usePedagogy";
import { toast } from "../../stores/toastStore";
import { Select } from "../ui";

const inputClass =
  "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-2.5 text-sm outline-none transition focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";

const ROLES = [
  { key: "constructive", label: "Tích cực", defaultScore: 1 },
  { key: "avoidant", label: "Né tránh", defaultScore: 0.5 },
  { key: "impulsive", label: "Bốc đồng", defaultScore: 0 },
];
const ALL_EMOTIONS = Object.keys(EMOTIONS);
const TITLE_AUTO_MAX = 60;
const PROMPTS_MAX = 3;

// Tên trường BE dùng trong thông báo 422 → nhãn tiếng Việt
const FIELD_LABELS = {
  questionFrame: "① Bé được hỏi về điều gì",
  pageSetup: "Bối cảnh trang truyện",
  rationale: "④ Căn cứ sư phạm",
  parentPrompts: "③ Gợi ý cho phụ huynh",
  hintGuidance: "Hướng dẫn gợi ý",
  allowedEmotions: "Cảm xúc cho phép",
  correctDesc: "Mô tả đáp án đúng",
  distractorDesc: "Mô tả đáp án nhiễu",
  constructiveDesc: "Mô tả cách Tích cực",
  avoidantDesc: "Mô tả cách Né tránh",
  impulsiveDesc: "Mô tả cách Bốc đồng",
  constructiveScore: "Điểm Tích cực",
  avoidantScore: "Điểm Né tránh",
  impulsiveScore: "Điểm Bốc đồng",
};

/** "Chưa đủ để ban hành, thiếu hoặc sai: questionFrame, parentPrompts (1-3 câu)." → danh sách nhãn tiếng Việt */
const missingLabels = (message) => {
  const match = /thiếu hoặc sai:\s*(.+?)\.?$/.exec(message);
  if (!match) return null;
  return match[1]
    .split(/,\s*(?=[a-zA-Z]+(?:\s|\(|$|,))/)
    .map((part) => part.replace(/[a-zA-Z]+/, (key) => FIELD_LABELS[key] ?? key));
};

const scoreText = (v, fallback) => (v == null || v === "" ? String(fallback) : String(Number(v)));

/** Trạng thái form từ một phiên bản (hoặc rỗng khi tạo mới). Mục Nâng cao điền sẵn giá trị mặc định. */
const toForm = (v) => ({
  questionFrame: v?.questionFrame ?? "",
  pageSetup: v?.pageSetup ?? "",
  needsTarget: v?.needsTarget ?? false,
  // Trống ở BE = cả 5 cảm xúc → hiện đủ 5 để chuyên gia thấy rõ
  allowedEmotions: v?.allowedEmotions?.length ? v.allowedEmotions : ALL_EMOTIONS,
  correctDesc: v?.correctDesc ?? "",
  distractorDesc: v?.distractorDesc ?? "",
  constructiveDesc: v?.constructiveDesc ?? "",
  avoidantDesc: v?.avoidantDesc ?? "",
  impulsiveDesc: v?.impulsiveDesc ?? "",
  constructiveScore: scoreText(v?.constructiveScore, 1),
  avoidantScore: scoreText(v?.avoidantScore, 0.5),
  impulsiveScore: scoreText(v?.impulsiveScore, 0),
  hintGuidance: v?.hintGuidance ?? "",
  parentPrompts: v?.parentPrompts?.length ? v.parentPrompts : [""],
  rationale: v?.rationale ?? "",
  referenceUrl: v?.referenceUrl || CASEL_URL,
});

const nullable = (s) => (s.trim() === "" ? null : s.trim());
const score = (s) => (s === "" || s == null ? null : Number(s));

/** Gom form → body PUT /:id/draft (khớp question-templates.validation.js: trường nullable gửi null khi để trống). */
const toPayload = (form, format) => {
  const payload = {
    questionFrame: form.questionFrame.trim(),
    pageSetup: nullable(form.pageSetup),
    needsTarget: form.needsTarget,
    rationale: nullable(form.rationale),
    referenceUrl: nullable(form.referenceUrl),
    parentPrompts: form.parentPrompts.map((p) => p.trim()).filter(Boolean),
  };
  if (format === "emotion_pick") {
    payload.allowedEmotions = form.allowedEmotions;
    payload.hintGuidance = nullable(form.hintGuidance);
  } else if (format === "single_correct") {
    payload.correctDesc = nullable(form.correctDesc);
    payload.distractorDesc = nullable(form.distractorDesc);
    payload.hintGuidance = nullable(form.hintGuidance);
  } else {
    for (const r of ROLES) {
      payload[`${r.key}Desc`] = nullable(form[`${r.key}Desc`]);
      payload[`${r.key}Score`] = score(form[`${r.key}Score`]);
    }
  }
  return payload;
};

/** Luật ban hành (assertVersionComplete, nới 2026-10-22): bối cảnh trang và hướng dẫn gợi ý không còn bắt buộc. */
const publishMissing = (form, format) => {
  const missing = [];
  if (!form.questionFrame.trim()) missing.push(FIELD_LABELS.questionFrame);
  const prompts = form.parentPrompts.map((p) => p.trim()).filter(Boolean);
  if (prompts.length < 1 || prompts.length > PROMPTS_MAX) missing.push(`${FIELD_LABELS.parentPrompts} (1–3 câu)`);
  if (!form.rationale.trim()) missing.push(FIELD_LABELS.rationale);
  if (format === "single_correct") {
    if (!form.correctDesc.trim()) missing.push(FIELD_LABELS.correctDesc);
    if (!form.distractorDesc.trim()) missing.push(FIELD_LABELS.distractorDesc);
  }
  if (format === "role_choice") {
    for (const r of ROLES) {
      if (!form[`${r.key}Desc`].trim()) missing.push(FIELD_LABELS[`${r.key}Desc`]);
      const s = score(form[`${r.key}Score`]);
      if (s == null || Number.isNaN(s) || s < 0 || s > 1) missing.push(`${FIELD_LABELS[`${r.key}Score`]} (0–1)`);
    }
    const [c, a, i] = ROLES.map((r) => score(form[`${r.key}Score`]));
    if (c != null && a != null && i != null && !(c > a && c > i)) missing.push("Điểm Tích cực phải lớn hơn hai cách còn lại");
  }
  return missing;
};

/** Tên mẫu tự sinh từ ý ①: cắt ~60 ký tự theo từ. */
const autoTitle = (frame) => {
  const text = frame.trim().replace(/\s+/g, " ");
  if (text.length <= TITLE_AUTO_MAX) return text;
  const cut = text.slice(0, TITLE_AUTO_MAX);
  const space = cut.lastIndexOf(" ");
  return `${(space > 30 ? cut.slice(0, space) : cut).replace(/[\s,.;:]+$/, "")}…`;
};

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-navy/50">{hint}</span>}
    </label>
  );
}

function Group({ title, hint, children }) {
  return (
    <section className="space-y-3 rounded-2xl border border-outline p-4">
      <div>
        <h3 className="text-base">{title}</h3>
        {hint && <p className="text-xs text-navy/55">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function Preview({ form, format }) {
  return (
    <aside className="space-y-2 rounded-2xl bg-secondary-tint/50 p-4 text-sm">
      <p className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-secondary-dark uppercase">
        <Eye size={14} /> Xem trước
      </p>
      <p className="font-semibold">{form.questionFrame.trim() || <span className="text-navy/40">Ý định câu hỏi (ô ①)</span>}</p>
      {format === "emotion_pick" && (
        <div className="flex flex-wrap gap-1.5">
          {(form.allowedEmotions.length ? form.allowedEmotions : ALL_EMOTIONS).map((e) => (
            <span key={e} className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold">
              {EMOTIONS[e]}
            </span>
          ))}
        </div>
      )}
      {format === "single_correct" && (
        <ul className="space-y-1">
          <li className="rounded-xl bg-white px-3 py-1.5">
            <span className="font-bold text-secondary-dark">Đáp án đúng:</span> {form.correctDesc.trim() || "—"}
          </li>
          <li className="rounded-xl bg-white px-3 py-1.5">
            <span className="font-bold text-navy/60">Đáp án nhiễu:</span> {form.distractorDesc.trim() || "—"}
          </li>
        </ul>
      )}
      {format === "role_choice" && (
        <ul className="space-y-1">
          {ROLES.map((r) => (
            <li key={r.key} className="flex items-start gap-2 rounded-xl bg-white px-3 py-1.5">
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${OPTION_ROLES[r.key].tone}`}>
                {r.label} · {form[`${r.key}Score`] || "?"}
              </span>
              <span className="min-w-0 flex-1">{form[`${r.key}Desc`].trim() || "—"}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-navy/55">AI sẽ viết câu cụ thể theo từng truyện, dựa trên ý định và cách chấm ở trên.</p>
    </aside>
  );
}

/**
 * Một màn hình cho cả tạo mới lẫn soạn phiên bản mẫu câu hỏi (spec 2026-10-22 §4.2).
 * Tạo mới: POST /question-templates → PUT /:id/draft → (Ban hành) POST /:id/publish.
 */
function TemplateVersionForm({ template, subSkills = [], defaultSubSkillId = "", onClose }) {
  const isNew = !template;
  const source = template?.draft ?? template?.latestPublished;
  const [meta, setMeta] = useState({
    subSkillId: template?.subSkill?.id ?? template?.subSkillId ?? defaultSubSkillId,
    // Mẫu mới mở từ một kỹ năng con: chọn sẵn dạng gợi ý của năng lực đó
    answerFormat:
      template?.answerFormat ??
      SUGGESTED_FORMATS[subSkills.find((s) => s.id === defaultSubSkillId)?.skill?.caselCode]?.formats[0] ??
      "emotion_pick",
    title: template?.title ?? "",
  });
  // Chọn năng lực CASEL trước rồi mới tới kỹ năng con của năng lực đó (40 mục quá dài để chọn một lượt)
  const skills = [...new Map(subSkills.filter((s) => s.skill).map((s) => [s.skill.id, s.skill])).values()];
  const [skillId, setSkillId] = useState(() => subSkills.find((s) => s.id === meta.subSkillId)?.skill?.id ?? "");
  const [formatTouched, setFormatTouched] = useState(false);
  const selectedSkill = skills.find((k) => k.id === skillId);
  const suggestion = SUGGESTED_FORMATS[selectedSkill?.caselCode];
  const [createdId, setCreatedId] = useState(null); // tạo xong nhưng lưu nháp lỗi → lần sau không tạo lại
  const [form, setForm] = useState(() => toForm(source));
  const [advanced, setAdvanced] = useState(false);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState(null);
  const create = useCreateTemplate();
  const rename = useUpdateTemplate();
  const save = useSaveTemplateDraft();
  const publish = usePublishTemplate();
  const pending = create.isPending || rename.isPending || save.isPending || publish.isPending;
  const [publishing, setPublishing] = useState(false);
  const format = meta.answerFormat;
  const templateId = template?.id ?? createdId;

  const clearMessages = () => {
    setError("");
    setMissing(null);
  };
  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    clearMessages();
  };
  const setMetaField = (key) => (e) => {
    setMeta((m) => ({ ...m, [key]: e.target.value }));
    clearMessages();
  };
  const setPrompt = (i, value) => setForm((f) => ({ ...f, parentPrompts: f.parentPrompts.map((p, idx) => (idx === i ? value : p)) }));
  const toggleEmotion = (key) =>
    setForm((f) => ({
      ...f,
      allowedEmotions: f.allowedEmotions.includes(key) ? f.allowedEmotions.filter((e) => e !== key) : [...f.allowedEmotions, key],
    }));

  const resolvedTitle = meta.title.trim() || autoTitle(form.questionFrame);

  const fail = (err) => {
    const labels = missingLabels(err.message);
    if (labels) setMissing(labels);
    else setError(err.message);
  };

  /** Đảm bảo có mẫu (tạo nếu mới) và tên đúng → trả về id. */
  const ensureTemplate = async () => {
    if (templateId) {
      if (template && resolvedTitle !== template.title) await rename.mutateAsync({ id: templateId, title: resolvedTitle });
      return templateId;
    }
    const t = await create.mutateAsync({ subSkillId: meta.subSkillId, title: resolvedTitle, answerFormat: format });
    setCreatedId(t.id);
    return t.id;
  };

  const submit = async (andPublish) => {
    clearMessages();
    if (isNew && !meta.subSkillId) return setError("Chọn kỹ năng con cho mẫu câu hỏi");
    if (resolvedTitle.length < 3) return setError("Nhập ý ① (hoặc tên mẫu) để đặt tên cho mẫu, tối thiểu 3 ký tự");
    if (andPublish) {
      const gaps = publishMissing(form, format);
      if (gaps.length) return setMissing(gaps);
    }
    setPublishing(andPublish);
    try {
      const id = await ensureTemplate();
      await save.mutateAsync({ id, ...toPayload(form, format) });
      if (andPublish) {
        const t = await publish.mutateAsync(id);
        toast.success(`Đã ban hành phiên bản ${t.latestPublished?.version ?? ""}`.trim());
      } else {
        toast.success(isNew && !createdId ? "Đã tạo mẫu câu hỏi và lưu bản nháp" : "Đã lưu bản nháp");
      }
      onClose();
    } catch (err) {
      fail(err); // 422 khi ban hành: liệt kê trường thiếu; bản nháp đã được lưu
    } finally {
      setPublishing(false);
    }
  };

  const versionNote = isNew
    ? "Mẫu mới, bản nháp v1"
    : template.draft
      ? `Đang sửa bản nháp v${template.draft.version}`
      : `Sửa sẽ tạo bản nháp mới từ v${template.latestPublished?.version ?? 1}`;
  const subSkill = subSkills.find((s) => s.id === meta.subSkillId) ?? template?.subSkill;

  return (
    <Modal
      open
      onClose={onClose}
      size="max-w-3xl"
      title={isNew ? "Thêm mẫu câu hỏi" : `Soạn mẫu: ${template.title}`}
      description={`${versionNote}. Bản đã ban hành không bao giờ bị sửa. Mẫu viết theo kỹ năng, dùng cho mọi chuyện (chuyện mẫu lẫn chuyện nhà).`}
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Đóng
          </button>
          <button
            type="button"
            onClick={() => submit(false)}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary-tint px-5 py-2.5 text-sm font-bold text-secondary-dark hover:opacity-80 disabled:opacity-70"
          >
            {pending && !publishing && <Loader2 size={16} className="animate-spin" />} Lưu bản nháp
          </button>
          <button type="button" onClick={() => submit(true)} disabled={pending} className="btn-primary py-2.5 text-sm disabled:opacity-70">
            {pending && publishing && <Loader2 size={16} className="animate-spin" />} Ban hành
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Năng lực CASEL">
            {isNew ? (
              <Select
                value={skillId}
                onChange={(v) => {
                  setSkillId(v);
                  // Chưa tự chọn dạng trả lời → đặt sẵn dạng gợi ý đầu tiên của năng lực này
                  const next = SUGGESTED_FORMATS[skills.find((k) => k.id === v)?.caselCode]?.formats;
                  if (!formatTouched && next && !next.includes(meta.answerFormat)) setMetaField("answerFormat")({ target: { value: next[0] } });
                  // Kỹ năng con đang chọn không thuộc năng lực mới → bỏ chọn
                  if (subSkills.find((s) => s.id === meta.subSkillId)?.skill?.id !== v) setMetaField("subSkillId")({ target: { value: "" } });
                }}
                placeholder="Chọn năng lực"
                options={skills.map((k) => ({ value: k.id, label: k.nameVi }))}
              />
            ) : (
              <p className="rounded-2xl bg-surface px-4 py-2.5 text-sm">{subSkill?.skill?.nameVi ?? "—"}</p>
            )}
          </Field>
          <Field label="Kỹ năng con">
            {isNew ? (
              <Select
                value={meta.subSkillId}
                onChange={(v) => setMetaField("subSkillId")({ target: { value: v } })}
                placeholder={skillId ? "Chọn kỹ năng con" : "Chọn năng lực trước"}
                disabled={!skillId}
                options={subSkills
                  .filter((s) => s.skill?.id === skillId)
                  .map((s) => ({ value: s.id, label: s.isActive === false ? `${s.nameVi} (đã tắt)` : s.nameVi }))}
              />
            ) : (
              <p className="rounded-2xl bg-surface px-4 py-2.5 text-sm">{subSkill?.nameVi ?? "—"}</p>
            )}
          </Field>
          <Field label="Dạng trả lời" hint={isNew ? "Không đổi được sau khi tạo" : undefined}>
            {isNew ? (
              <Select
                value={meta.answerFormat}
                onChange={(v) => {
                  setFormatTouched(true);
                  setMetaField("answerFormat")({ target: { value: v } });
                }}
                options={Object.entries(ANSWER_FORMATS).map(([value, label]) => ({
                  value,
                  label: suggestion?.formats.includes(value) ? `${label} · gợi ý` : label,
                }))}
              />
            ) : (
              <p className="rounded-2xl bg-surface px-4 py-2.5 text-sm">{ANSWER_FORMATS[format]}</p>
            )}
          </Field>
        </div>
        {isNew && suggestion && (
          <p
            className={`-mt-1 rounded-2xl px-4 py-2.5 text-xs ${
              suggestion.formats.includes(meta.answerFormat) ? "bg-secondary-tint text-secondary-dark" : "bg-amber-100 text-amber-900"
            }`}
          >
            <b>Gợi ý cho {selectedSkill.nameVi}:</b> {suggestion.formats.map((f) => ANSWER_FORMATS[f]).join(" hoặc ")} — vì {suggestion.why}.
            {!suggestion.formats.includes(meta.answerFormat) &&
              ` “${ANSWER_FORMATS[meta.answerFormat]}” ít hợp với năng lực này; vẫn dùng được nếu câu hỏi đo đúng kỹ năng con đã chọn.`}
          </p>
        )}
        {subSkill?.descriptionVi && <p className="-mt-2 text-xs text-navy/55">{subSkill.descriptionVi}</p>}

        <Field label="Tên mẫu" hint={meta.title.trim() ? undefined : "Để trống: tự lấy từ ô ①"}>
          <input
            value={meta.title}
            onChange={setMetaField("title")}
            maxLength={200}
            placeholder={autoTitle(form.questionFrame) || "Nhập tên mẫu câu hỏi"}
            className={inputClass}
          />
        </Field>

        <Group title="① Bé được hỏi về điều gì" hint="Viết ý định câu hỏi, không phải câu cho bé — AI sẽ viết câu cụ thể theo từng truyện.">
          <textarea
            value={form.questionFrame}
            onChange={set("questionFrame")}
            rows={2}
            className={`${inputClass} resize-none`}
            placeholder="Mô tả câu hỏi cần hỏi bé…"
          />
          {format === "emotion_pick" && (
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={form.needsTarget} onChange={(e) => setForm((f) => ({ ...f, needsTarget: e.target.checked }))} />
              Hỏi cảm xúc của người khác (cần nhân vật phụ)
            </label>
          )}
        </Group>

        <Group title="② Chấm thế nào">
          {format === "emotion_pick" && (
            <p className="text-sm text-navy/70">Bé chọn một cảm xúc; đáp án đúng là cảm xúc AI dựng trong trang truyện. Đúng ngay lần đầu = 1 điểm.</p>
          )}
          {format === "single_correct" && (
            <>
              <Field label="Mô tả đáp án đúng">
                <textarea value={form.correctDesc} onChange={set("correctDesc")} rows={2} className={`${inputClass} resize-none`} />
              </Field>
              <Field label="Mô tả đáp án nhiễu" hint="AI viết các đáp án sai hợp lý theo mô tả này">
                <textarea value={form.distractorDesc} onChange={set("distractorDesc")} rows={2} className={`${inputClass} resize-none`} />
              </Field>
            </>
          )}
          {format === "role_choice" && (
            <>
              {ROLES.map((r) => (
                <Field key={r.key} label={`Cách ${r.label}`}>
                  <textarea value={form[`${r.key}Desc`]} onChange={set(`${r.key}Desc`)} rows={2} className={`${inputClass} resize-none`} />
                </Field>
              ))}
              <p className="text-xs text-navy/50">Điểm từng cách nằm trong mục Nâng cao (mặc định 1 / 0,5 / 0).</p>
            </>
          )}
        </Group>

        <Group title="③ Gợi ý cho phụ huynh" hint="1–3 câu ba mẹ dùng để trò chuyện với bé sau khi đọc.">
          <div className="space-y-2">
            {form.parentPrompts.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={p} onChange={(e) => setPrompt(i, e.target.value)} maxLength={500} className={inputClass} placeholder={`Câu gợi ý ${i + 1}`} />
                {form.parentPrompts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, parentPrompts: f.parentPrompts.filter((_, idx) => idx !== i) }))}
                    className="rounded-full p-2 text-navy/50 hover:bg-surface"
                    aria-label="Bỏ câu gợi ý"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            {form.parentPrompts.length < PROMPTS_MAX && (
              <button type="button" onClick={() => setForm((f) => ({ ...f, parentPrompts: [...f.parentPrompts, ""] }))} className="inline-flex items-center gap-1 text-sm font-bold text-secondary-dark">
                <Plus size={14} /> Thêm câu gợi ý
              </button>
            )}
          </div>
        </Group>

        <Group title="④ Căn cứ sư phạm" hint="Vì sao mẫu này đo đúng kỹ năng con">
          <textarea value={form.rationale} onChange={set("rationale")} rows={2} className={`${inputClass} resize-none`} />
        </Group>

        <div className="rounded-2xl border border-outline">
          <button type="button" onClick={() => setAdvanced((a) => !a)} aria-expanded={advanced} className="flex w-full items-center gap-2 px-4 py-3 text-left font-display font-bold">
            {advanced ? <ChevronDown size={18} /> : <ChevronRight size={18} />} Nâng cao
            <span className="text-xs font-normal text-navy/50">không bắt buộc — đã điền sẵn giá trị mặc định</span>
          </button>
          {advanced && (
            <div className="space-y-4 border-t border-outline p-4">
              {format === "role_choice" && (
                <div>
                  <span className="mb-1.5 block text-sm font-semibold">Điểm từng cách (0–1)</span>
                  <div className="grid grid-cols-3 gap-3">
                    {ROLES.map((r) => (
                      <Field key={r.key} label={r.label}>
                        <input type="number" min={0} max={1} step={0.05} value={form[`${r.key}Score`]} onChange={set(`${r.key}Score`)} className={inputClass} />
                      </Field>
                    ))}
                  </div>
                  <span className="mt-1 block text-xs text-navy/50">Điểm cách Tích cực phải lớn hơn điểm hai cách còn lại.</span>
                </div>
              )}
              {format === "emotion_pick" && (
                <div>
                  <span className="mb-1.5 block text-sm font-semibold">Cảm xúc cho phép</span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(EMOTIONS).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleEmotion(key)}
                        aria-pressed={form.allowedEmotions.includes(key)}
                        className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                          form.allowedEmotions.includes(key) ? "bg-secondary text-white" : "bg-surface text-navy/70 hover:bg-outline"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <span className="mt-1 block text-xs text-navy/50">Bỏ chọn hết = cho bé chọn cả 5 cảm xúc</span>
                </div>
              )}
              <Field label="Bối cảnh trang truyện" hint="Gợi ý cho AI viết trang dẫn tới câu hỏi; để trống thì AI tự suy ra">
                <textarea value={form.pageSetup} onChange={set("pageSetup")} rows={2} className={`${inputClass} resize-none`} />
              </Field>
              {format !== "role_choice" && (
                <Field label="Hướng dẫn gợi ý" hint="Gợi ý nhẹ nhàng khi bé chọn chưa đúng; để trống thì AI tự viết">
                  <textarea value={form.hintGuidance} onChange={set("hintGuidance")} rows={2} className={`${inputClass} resize-none`} />
                </Field>
              )}
              <Field label="Đường dẫn tham khảo">
                <input value={form.referenceUrl} onChange={set("referenceUrl")} placeholder="https://..." className={inputClass} />
              </Field>
            </div>
          )}
        </div>

        <Preview form={form} format={format} />

        {missing && (
          <div role="alert" className="rounded-2xl bg-danger-tint px-4 py-3 text-sm text-danger">
            <p className="font-bold">Chưa đủ để ban hành, cần bổ sung:</p>
            <ul className="mt-1 list-disc pl-5">
              {missing.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        )}
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      </div>
    </Modal>
  );
}

export default TemplateVersionForm;
