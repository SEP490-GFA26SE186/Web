import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { fillNames } from "../../../utils/storyNames";
import { Badge } from "../../ui";
import SaveBar from "./SaveBar";

export const fieldClass =
  "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-3 outline-none transition placeholder:text-navy/40 focus:border-secondary focus:ring-[3px] focus:ring-secondary/15 disabled:bg-surface";

const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

/** Sửa chữ một trang. Hiện tên thật thay token; lưu gửi chữ có tên, BE tự đổi lại thành token. */
function PageEditor({ page, characters, disabled, gap, warning, onSave, saving, onDelete, deleting }) {
  const original = fillNames(page.contentText, characters);
  const [text, setText] = useState(original);
  const dirty = text !== original;

  return (
    <article
      id={`page-${page.id}`}
      className={`card space-y-3 p-5 ${gap ? "border-danger ring-2 ring-danger/20" : ""}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-base">
          Trang {page.pageOrder}
          {dirty && (
            <Badge tone="primary" size="sm">
              Chưa lưu
            </Badge>
          )}
        </h3>
        <div className="flex items-center gap-2 text-xs font-semibold text-navy/55">
          {page.origin === "ai" && <span className="tag-theme">AI viết</span>}
          {page.origin === "ai_edited" && <span className="tag-theme">AI viết, ba mẹ sửa</span>}
          <span>{wordCount(text)} tiếng</span>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={disabled || deleting}
              aria-label={`Xóa trang ${page.pageOrder}`}
              title={`Xóa trang ${page.pageOrder}`}
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-navy/45 transition hover:bg-danger-tint hover:text-danger disabled:pointer-events-none disabled:opacity-40"
            >
              {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>
          )}
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        rows={5}
        placeholder="Viết lời kể cho trang này…"
        className={fieldClass}
      />
      {gap && <p className="text-sm font-semibold text-danger">{gap}</p>}
      {!gap && warning && <p className="text-sm font-semibold text-amber-700">{warning}</p>}
      <SaveBar dirty={dirty} saving={saving} disabled={disabled} onSave={() => onSave(text)} onReset={() => setText(original)} label="Lưu trang" />
    </article>
  );
}

export default PageEditor;
