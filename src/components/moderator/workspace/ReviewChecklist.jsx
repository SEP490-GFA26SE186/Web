import { forwardRef, useState } from "react";
import { Bot, Brain, CheckCheck, ChevronDown, ClipboardCheck, HeartPulse, LockKeyhole, MessageSquareText, RotateCcw, UserRound } from "lucide-react";
import { QUICK_FEEDBACK, REVIEW_CHECKLIST } from "../../../mocks/moderator";

const SECTION_ICONS = { privacy: LockKeyhole, casel: Brain, safety: HeartPulse };

function ChecklistSection({ section, index, checks, readOnly, highlightMissing, onToggle }) {
  const Icon = SECTION_ICONS[section.icon];
  const done = section.items.filter((i) => checks[i.key]).length;
  const complete = done === section.items.length;
  const tone = section.tone === "primary" ? "text-primary-dark" : "text-secondary-dark";

  return (
    <div className="relative flex flex-col gap-1.5 overflow-hidden rounded-card bg-white p-4 shadow-low">
      {section.tone === "primary" && <div className="pointer-events-none absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-primary-tint/70" />}
      <div className="relative flex items-center justify-between gap-2 pb-1">
        <span className={`flex items-center gap-1 text-[11px] font-extrabold tracking-wider uppercase ${tone}`}>
          <Icon size={16} /> {index + 1}. {section.title}
        </span>
        <span className={`flex shrink-0 items-center gap-0.5 text-xs font-bold ${complete ? "text-secondary-dark" : "text-primary-dark"}`}>
          {complete && <CheckCheck size={14} />} {done}/{section.items.length} {complete ? "Hoàn tất" : "Hoàn thành"}
        </span>
      </div>
      {section.items.map((item) => {
        const checked = !!checks[item.key];
        const missing = highlightMissing && !checked;
        return (
          <label
            key={item.key}
            id={`check-${item.key}`}
            className={`relative flex items-start gap-3 rounded-xl p-2 transition ${
              readOnly ? "cursor-default" : "cursor-pointer hover:bg-surface"
            } ${missing ? "animate-pulse bg-primary-tint ring-2 ring-primary/50" : !checked ? "bg-primary-tint/50" : ""}`}
          >
            <input
              type="checkbox"
              checked={checked}
              disabled={readOnly}
              onChange={() => onToggle(item.key)}
              className={`mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded ${checked ? "accent-secondary" : "accent-primary"}`}
            />
            <span className="text-sm">
              <span className={`flex flex-wrap items-center gap-1.5 font-bold ${checked ? "" : "text-primary-dark"}`}>
                {item.title}
                {item.aiPrefill && (
                  <span className="inline-flex items-center gap-0.5 rounded bg-navy-tint px-1 text-[10px] font-bold text-navy-soft" title="AI Guard tự kiểm tra sẵn">
                    <Bot size={10} /> AI
                  </span>
                )}
              </span>
              <span className="text-navy/65">{item.desc}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}

const ReviewChecklist = forwardRef(function ReviewChecklist(
  { page, readOnly, highlightMissing, onToggleCheck, onReopen, onNoteChange, onFlagChange, history },
  noteRef,
) {
  const [tab, setTab] = useState("checklist");
  const [templatesOpen, setTemplatesOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-card bg-surface p-4 shadow-low">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg">
            <ClipboardCheck size={22} className="text-primary" /> Biên bản thẩm định
          </h2>
          <span className="rounded-full bg-primary-tint px-2.5 py-0.5 text-xs font-bold text-primary-dark">BẮT BUỘC</span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-outline/80 p-1" role="tablist">
          {[
            { value: "checklist", label: "Checklist Sư phạm & An toàn" },
            { value: "history", label: "Lịch sử & Ghi chú", count: history.length },
          ].map((t) => (
            <button
              key={t.value}
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => setTab(t.value)}
              className={`flex flex-1 items-center justify-center gap-1 rounded-full px-2 py-1.5 text-xs font-bold transition ${
                tab === t.value ? "bg-white shadow-low" : "text-navy/60 hover:text-navy"
              }`}
            >
              {t.label}
              {t.count != null && <span className="rounded-full bg-surface px-1.5 text-[10px]">{t.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {tab === "history" ? (
        <div className="flex flex-col gap-2 rounded-card bg-white p-4 shadow-low">
          {history.map((h) => (
            <div key={h.id} className="flex gap-3 rounded-xl bg-surface p-3 text-sm">
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                  h.type === "ai" ? "bg-navy-tint text-navy-soft" : h.type === "fix" ? "bg-danger-tint text-danger" : h.type === "approve" ? "bg-secondary-tint text-secondary-dark" : "bg-primary-tint text-primary-dark"
                }`}
              >
                {h.type === "ai" ? <Bot size={16} /> : <UserRound size={16} />}
              </span>
              <div>
                <p className="text-xs text-navy/60">
                  <b className="text-navy">{h.author}</b> • {h.time}
                </p>
                <p className="text-navy/85">{h.text}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {readOnly && (
            <div className="flex items-center justify-between gap-2 rounded-2xl bg-secondary-tint px-4 py-3 text-sm">
              <span className="font-semibold text-secondary-dark">
                Trang {page.number} {page.status === "approved" ? "đã được duyệt đạt" : "đã gửi yêu cầu sửa"}.
              </span>
              <button onClick={onReopen} className="flex shrink-0 items-center gap-1 text-xs font-bold text-primary-dark hover:underline">
                <RotateCcw size={13} /> Duyệt lại trang này
              </button>
            </div>
          )}

          {REVIEW_CHECKLIST.map((section, i) => (
            <ChecklistSection
              key={section.id}
              section={section}
              index={i}
              checks={page.checks}
              readOnly={readOnly}
              highlightMissing={highlightMissing}
              onToggle={onToggleCheck}
            />
          ))}

          <div className="flex flex-col gap-2 rounded-card bg-white p-4 shadow-low">
            <span className="flex items-center gap-1 text-[11px] font-extrabold tracking-wider text-navy/60 uppercase">
              <MessageSquareText size={16} /> 4. Ghi chú phản hồi cho tác giả
            </span>
            <textarea
              ref={noteRef}
              value={page.note}
              disabled={readOnly}
              onChange={(e) => onNoteChange(e.target.value)}
              rows={3}
              placeholder={`Thêm nhận xét cụ thể cho Trang ${page.number} nếu cần yêu cầu tác giả tinh chỉnh lời thoại...`}
              className="w-full resize-none rounded-xl bg-surface p-3 text-sm outline-none placeholder:text-navy/40 focus:ring-2 focus:ring-secondary/40 disabled:opacity-70"
            />
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-navy/70">
                <input
                  type="checkbox"
                  checked={page.flagged}
                  disabled={readOnly}
                  onChange={(e) => onFlagChange(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                Gắn cờ trang này cần chỉnh sửa lại
              </label>
              <div className="relative">
                <button
                  disabled={readOnly}
                  onClick={() => setTemplatesOpen((v) => !v)}
                  className="flex items-center gap-0.5 text-xs font-bold text-secondary-dark hover:underline disabled:opacity-50"
                >
                  Mẫu góp ý nhanh <ChevronDown size={13} />
                </button>
                {templatesOpen && (
                  <div className="absolute right-0 bottom-full z-20 mb-2 w-72 rounded-2xl border border-outline bg-white p-1.5 shadow-high">
                    {QUICK_FEEDBACK.map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          onNoteChange(page.note ? `${page.note}\n${t}` : t);
                          setTemplatesOpen(false);
                        }}
                        className="w-full rounded-xl px-3 py-2 text-left text-xs hover:bg-surface"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default ReviewChecklist;
