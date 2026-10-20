import { useState } from "react";
import { Loader2, Plus, Rocket, Save, X } from "lucide-react";
import Modal from "../common/Modal";
import { ANSWER_FORMATS, EMOTIONS } from "../../constants/story";
import { usePublishTemplate, useSaveTemplateDraft } from "../../hooks/usePedagogy";
import { toast } from "../../stores/toastStore";

const inputClass =
  "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-2.5 text-sm outline-none transition focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";


const ROLES = [
  { key: "constructive", label: "Tích cực" },
  { key: "avoidant", label: "Né tránh" },
  { key: "impulsive", label: "Bốc đồng" },
];

// Tên trường BE dùng trong thông báo 422 → nhãn tiếng Việt
const FIELD_LABELS = {
  questionFrame: "Câu hỏi",
  pageSetup: "Bối cảnh trang truyện",
  rationale: "Căn cứ sư phạm",
  parentPrompts: "Câu gợi ý cho phụ huynh",
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

/** "Chưa đủ để ban hành, thiếu hoặc sai: questionFrame, parentPrompts (2-3 câu)." → danh sách nhãn tiếng Việt */
const missingLabels = (message) => {
  const match = /thiếu hoặc sai:\s*(.+?)\.?$/.exec(message);
  if (!match) return null;
  return match[1]
    .split(/,\s*(?=[a-zA-Z]+(?:\s|\(|$|,))/)
    .map((part) => part.replace(/[a-zA-Z]+/, (key) => FIELD_LABELS[key] ?? key));
};

const toForm = (v) => ({
  questionFrame: v?.questionFrame ?? "",
  pageSetup: v?.pageSetup ?? "",
  needsTarget: v?.needsTarget ?? false,
  allowedEmotions: v?.allowedEmotions ?? [],
  correctDesc: v?.correctDesc ?? "",
  distractorDesc: v?.distractorDesc ?? "",
  constructiveDesc: v?.constructiveDesc ?? "",
  avoidantDesc: v?.avoidantDesc ?? "",
  impulsiveDesc: v?.impulsiveDesc ?? "",
  constructiveScore: v?.constructiveScore ?? "",
  avoidantScore: v?.avoidantScore ?? "",
  impulsiveScore: v?.impulsiveScore ?? "",
  hintGuidance: v?.hintGuidance ?? "",
  parentPrompts: v?.parentPrompts?.length ? v.parentPrompts : ["", ""],
  rationale: v?.rationale ?? "",
  referenceUrl: v?.referenceUrl ?? "",
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

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-navy/50">{hint}</span>}
    </label>
  );
}

function TemplateVersionForm({ template, onClose }) {
  const source = template.draft ?? template.latestPublished;
  const [form, setForm] = useState(() => toForm(source));
  const [error, setError] = useState("");
  const [missing, setMissing] = useState(null);
  const save = useSaveTemplateDraft();
  const publish = usePublishTemplate();
  const pending = save.isPending || publish.isPending;
  const format = template.answerFormat;

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError("");
    setMissing(null);
  };
  const setPrompt = (i, value) => setForm((f) => ({ ...f, parentPrompts: f.parentPrompts.map((p, idx) => (idx === i ? value : p)) }));
  const toggleEmotion = (key) =>
    setForm((f) => ({
      ...f,
      allowedEmotions: f.allowedEmotions.includes(key) ? f.allowedEmotions.filter((e) => e !== key) : [...f.allowedEmotions, key],
    }));

  const fail = (err) => {
    const labels = missingLabels(err.message);
    if (labels) setMissing(labels);
    else setError(err.message);
  };

  const saveDraft = (then) => {
    setError("");
    setMissing(null);
    save.mutate({ id: template.id, ...toPayload(form, format) }, { onSuccess: then, onError: fail });
  };

  const onSave = () =>
    saveDraft(() => {
      toast.success("Đã lưu bản nháp");
      onClose();
    });

  const onPublish = () =>
    saveDraft(() =>
      publish.mutate(template.id, {
        onSuccess: (t) => {
          toast.success(`Đã ban hành phiên bản ${t.latestPublished?.version ?? ""}`.trim());
          onClose();
        },
        onError: fail, // 422: liệt kê trường thiếu; bản nháp đã được lưu
      }),
    );

  return (
    <Modal
      open
      onClose={onClose}
      size="max-w-2xl"
      title={`Soạn nội dung: ${template.title}`}
      description={`${ANSWER_FORMATS[format]} · ${template.draft ? `Đang sửa bản nháp v${template.draft.version}` : `Sửa sẽ tạo bản nháp mới từ v${template.latestPublished?.version ?? 1}`}. Bản đã ban hành không bao giờ bị sửa.`}
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Đóng
          </button>
          <button type="button" onClick={onSave} disabled={pending} className="inline-flex items-center gap-1.5 rounded-full bg-secondary-tint px-5 py-2.5 text-sm font-bold text-secondary-dark hover:opacity-80 disabled:opacity-70">
            {save.isPending && !publish.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Lưu bản nháp
          </button>
          <button type="button" onClick={onPublish} disabled={pending} className="btn-primary py-2.5 text-sm disabled:opacity-70">
            {pending ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={16} />} Ban hành
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Câu hỏi (khung)" hint="Câu hỏi hiển thị cho bé tại điểm dừng của truyện">
          <textarea value={form.questionFrame} onChange={set("questionFrame")} rows={2} className={`${inputClass} resize-none`} placeholder="VD: Bạn nhỏ đang cảm thấy thế nào?" />
        </Field>
        <Field label="Bối cảnh trang truyện" hint="Gợi ý cho AI viết trang truyện dẫn tới câu hỏi này">
          <textarea value={form.pageSetup} onChange={set("pageSetup")} rows={2} className={`${inputClass} resize-none`} />
        </Field>

        {format === "emotion_pick" && (
          <>
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
              <span className="mt-1 block text-xs text-navy/50">Để trống = cho bé chọn cả 5 cảm xúc</span>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={form.needsTarget} onChange={(e) => setForm((f) => ({ ...f, needsTarget: e.target.checked }))} />
              Hỏi cảm xúc của người khác (cần chọn nhân vật đích)
            </label>
          </>
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
          <div className="space-y-3">
            {ROLES.map((r) => (
              <div key={r.key} className="rounded-2xl bg-surface p-3">
                <div className="grid gap-3 sm:grid-cols-[1fr_6rem]">
                  <Field label={`Cách ${r.label}`}>
                    <textarea value={form[`${r.key}Desc`]} onChange={set(`${r.key}Desc`)} rows={2} className={`${inputClass} resize-none`} />
                  </Field>
                  <Field label="Điểm 0–1">
                    <input type="number" min={0} max={1} step={0.05} value={form[`${r.key}Score`]} onChange={set(`${r.key}Score`)} className={inputClass} />
                  </Field>
                </div>
              </div>
            ))}
            <p className="text-xs text-navy/50">Điểm cách Tích cực phải lớn hơn điểm hai cách còn lại.</p>
          </div>
        )}

        {format !== "role_choice" && (
          <Field label="Hướng dẫn gợi ý" hint="Gợi ý nhẹ nhàng khi bé chọn chưa đúng">
            <textarea value={form.hintGuidance} onChange={set("hintGuidance")} rows={2} className={`${inputClass} resize-none`} />
          </Field>
        )}

        <div>
          <span className="mb-1.5 block text-sm font-semibold">Câu gợi ý cho phụ huynh (2–3 câu)</span>
          <div className="space-y-2">
            {form.parentPrompts.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={p} onChange={(e) => setPrompt(i, e.target.value)} maxLength={500} className={inputClass} placeholder={`Câu gợi ý ${i + 1}`} />
                {form.parentPrompts.length > 2 && (
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
            {form.parentPrompts.length < 3 && (
              <button type="button" onClick={() => setForm((f) => ({ ...f, parentPrompts: [...f.parentPrompts, ""] }))} className="inline-flex items-center gap-1 text-sm font-bold text-secondary-dark">
                <Plus size={14} /> Thêm câu gợi ý
              </button>
            )}
          </div>
        </div>

        <Field label="Căn cứ sư phạm" hint="Vì sao mẫu này đo đúng kỹ năng con">
          <textarea value={form.rationale} onChange={set("rationale")} rows={2} className={`${inputClass} resize-none`} />
        </Field>
        <Field label="Đường dẫn tham khảo (tuỳ chọn)">
          <input value={form.referenceUrl} onChange={set("referenceUrl")} placeholder="https://..." className={inputClass} />
        </Field>

        {missing && (
          <div role="alert" className="rounded-2xl bg-danger-tint px-4 py-3 text-sm text-danger">
            <p className="font-bold">Chưa đủ để ban hành. Bản nháp đã được lưu, cần bổ sung:</p>
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
