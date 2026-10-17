import { useState } from "react";
import { CircleHelp, Loader2, Save, Trash2 } from "lucide-react";
import { CHECKPOINT_TYPES, EMOTIONS, OPTION_ROLES } from "../../../constants/story";
import { fillNames, nameOfToken } from "../../../utils/storyNames";
import { fieldClass } from "./PageEditor";

const OPTION_COUNT = 3;
const ROLE_ORDER = ["constructive", "avoidant", "impulsive"];

/** Trạng thái form từ điểm dừng của BE (chữ token → tên). Luôn đủ 3 phương án cho 2 kiểu có phương án. */
function initialForm(cp, characters) {
  const name = (t) => fillNames(t, characters);
  let options = [];
  if (cp.type === "perspective") {
    options = Array.from({ length: OPTION_COUNT }, (_, i) => ({
      text: name(cp.options[i]?.text),
      isCorrect: cp.options[i]?.isCorrect === true,
    }));
  } else if (cp.type === "problem_solving") {
    // Vai do khung quy định: giữ vai có sẵn, thiếu thì lấp theo thứ tự xây dựng / né tránh / bốc đồng.
    const byRole = new Map(cp.options.map((o) => [o.role, o]));
    options = ROLE_ORDER.map((role) => ({
      role,
      text: name(byRole.get(role)?.text),
      feedback: name(byRole.get(role)?.feedback),
    }));
  }
  return { question: name(cp.question), hint: name(cp.hint), answerEmotion: cp.answerEmotion ?? "", options };
}

/** Body gửi PUT /stories/:id/checkpoints/:cpId theo đúng luật từng kiểu (editorRules.js của BE). */
function toBody(type, form) {
  const body = { question: form.question };
  if (type === "emotion_self" || type === "emotion_other") {
    return { ...body, hint: form.hint, answerEmotion: form.answerEmotion || "neutral" };
  }
  if (type === "perspective") {
    return { ...body, hint: form.hint, options: form.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })) };
  }
  if (type === "problem_solving") {
    return { ...body, options: form.options.map((o) => ({ text: o.text, role: o.role, feedback: o.feedback })) };
  }
  return body; // reflection: chỉ có câu hỏi
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}

function CheckpointEditor({ checkpoint: cp, characters, disabled, gap, onSave, saving, onDelete, deleting }) {
  const [form, setForm] = useState(() => initialForm(cp, characters));
  const [dirty, setDirty] = useState(false);
  const meta = CHECKPOINT_TYPES[cp.type];
  const isEmotion = cp.type === "emotion_self" || cp.type === "emotion_other";

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setDirty(true);
  };
  const setOption = (i, patch) => {
    setForm((f) => ({ ...f, options: f.options.map((o, j) => (j === i ? { ...o, ...patch } : o)) }));
    setDirty(true);
  };
  const setCorrect = (i) => {
    setForm((f) => ({ ...f, options: f.options.map((o, j) => ({ ...o, isCorrect: j === i })) }));
    setDirty(true);
  };

  return (
    <section
      id={`checkpoint-${cp.id}`}
      className={`ml-4 space-y-4 rounded-card border-2 border-dashed border-secondary/40 bg-secondary-tint/40 p-5 sm:ml-10 ${
        gap ? "border-danger ring-2 ring-danger/20" : ""
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-base text-secondary-dark">
          <CircleHelp size={18} /> Điểm dừng sau trang {cp.afterPageOrder}: {meta?.label ?? cp.type}
        </h3>
        <div className="flex items-center gap-2">
          {cp.targetToken && (
            <span className="tag-eq">Hỏi về: {nameOfToken(cp.targetToken, characters)}</span>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={disabled || deleting}
              aria-label="Xóa điểm dừng"
              className="rounded-full p-1.5 text-navy/50 hover:bg-danger-tint hover:text-danger disabled:opacity-40"
            >
              {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>
          )}
        </div>
      </div>

      <Field label="Câu hỏi cho bé">
        <input value={form.question} onChange={set("question")} disabled={disabled} className={fieldClass} />
      </Field>

      {isEmotion && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Cảm xúc đúng">
            <select value={form.answerEmotion} onChange={set("answerEmotion")} disabled={disabled} className={fieldClass}>
              <option value="">— Chọn cảm xúc —</option>
              {Object.entries(EMOTIONS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Gợi ý khi bé chọn sai">
            <input value={form.hint} onChange={set("hint")} disabled={disabled} className={fieldClass} />
          </Field>
        </div>
      )}

      {cp.type === "perspective" && (
        <>
          <div className="space-y-2">
            <span className="block text-sm font-semibold">Ba phương án (đánh dấu phương án đúng)</span>
            {form.options.map((o, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`correct-${cp.id}`}
                  checked={o.isCorrect}
                  onChange={() => setCorrect(i)}
                  disabled={disabled}
                  aria-label={`Phương án ${i + 1} là đúng`}
                  className="h-5 w-5 accent-secondary"
                />
                <input
                  value={o.text}
                  onChange={(e) => setOption(i, { text: e.target.value })}
                  disabled={disabled}
                  placeholder={`Phương án ${i + 1}`}
                  className={fieldClass}
                />
              </div>
            ))}
          </div>
          <Field label="Gợi ý khi bé chọn sai">
            <input value={form.hint} onChange={set("hint")} disabled={disabled} className={fieldClass} />
          </Field>
        </>
      )}

      {cp.type === "problem_solving" && (
        <div className="space-y-3">
          <span className="block text-sm font-semibold">Ba cách bé có thể làm (vai do khung quy định)</span>
          {form.options.map((o, i) => (
            <div key={o.role} className="space-y-2 rounded-2xl bg-white p-3">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${OPTION_ROLES[o.role].tone}`}>
                {OPTION_ROLES[o.role].label}
              </span>
              <input
                value={o.text}
                onChange={(e) => setOption(i, { text: e.target.value })}
                disabled={disabled}
                placeholder="Bé sẽ làm gì?"
                className={fieldClass}
              />
              <input
                value={o.feedback}
                onChange={(e) => setOption(i, { feedback: e.target.value })}
                disabled={disabled}
                placeholder="Chuyện gì xảy ra sau đó?"
                className={fieldClass}
              />
            </div>
          ))}
        </div>
      )}

      {gap && <p className="text-sm font-semibold text-danger">{gap}</p>}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSave(toBody(cp.type, form), () => setDirty(false))}
          disabled={disabled || !dirty || saving}
          className="btn-primary px-5 py-2 text-sm disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Lưu điểm dừng
        </button>
      </div>
    </section>
  );
}

export default CheckpointEditor;
