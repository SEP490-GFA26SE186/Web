import { useState } from "react";
import { BadgeCheck, Check, CheckCircle2, Eye, FilePenLine, Flag, Hourglass, ListChecks, Lock, Split } from "lucide-react";

const FILTERS = [
  { value: "all", label: "Tất cả" },
  { value: "approved", label: "Đã duyệt" },
  { value: "open", label: "Đang xem" },
];

function PageItem({ page, active, locked, onSelect }) {
  const approved = page.status === "approved";
  const needsFix = page.status === "needs_fix";

  let statusText = "Chưa xem";
  let statusClass = "text-navy/50";
  if (approved) [statusText, statusClass] = ["Đã duyệt", "text-secondary-dark font-bold"];
  if (needsFix) [statusText, statusClass] = ["Yêu cầu sửa", "text-danger font-bold"];
  if (active && !approved && !needsFix) [statusText, statusClass] = ["Chờ xác nhận checklist", "text-primary font-bold"];

  const RightIcon = locked ? Lock : active ? FilePenLine : page.label === "Điểm rẽ" ? Split : approved ? (page.number === 1 ? BadgeCheck : CheckCircle2) : needsFix ? Flag : null;

  return (
    <button
      onClick={() => !locked && onSelect(page.number)}
      disabled={locked}
      aria-current={active ? "page" : undefined}
      title={locked ? "Duyệt xong các trang trước để mở trang này" : undefined}
      className={`relative flex w-full items-center gap-3 overflow-hidden rounded-2xl p-2 text-left transition ${
        active
          ? "bg-primary-tint pl-3 shadow-mid"
          : locked
            ? "cursor-not-allowed bg-white/60 opacity-70"
            : "bg-white shadow-low hover:bg-canvas"
      }`}
    >
      {active && <span className="absolute inset-y-0 left-0 w-1.5 bg-primary" />}
      <span
        className={`relative grid h-14 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-gradient-to-br text-2xl ${page.gradient} ${
          locked ? "grayscale" : ""
        }`}
      >
        {page.emoji}
        <span
          className={`absolute right-0 bottom-0 grid place-items-center rounded-tl-md p-0.5 text-white ${
            active ? "bg-primary" : approved ? "bg-secondary" : needsFix ? "bg-danger" : "bg-navy/30"
          }`}
        >
          {active ? <Eye size={11} /> : approved ? <Check size={11} /> : needsFix ? <Flag size={11} /> : <Hourglass size={11} />}
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-1">
          <span className={`text-xs font-bold ${active ? "text-primary-dark" : approved ? "text-secondary-dark" : "text-navy/60"}`}>
            Trang {page.number}
            {page.label && ` • ${page.label}`}
            {active && " • ĐANG XEM"}
          </span>
          {RightIcon && <RightIcon size={14} className={active ? "text-primary" : locked ? "text-navy/30" : approved ? "text-secondary" : "text-danger"} />}
        </span>
        <span className={`block truncate text-sm ${active ? "font-bold" : ""}`}>{page.title}</span>
        <span className={`flex items-center gap-1 text-[11px] ${statusClass}`}>
          {active && !approved && !needsFix && <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />}
          {statusText}
        </span>
      </span>
    </button>
  );
}

function PageNavigator({ pages, currentNumber, isLocked, onSelect }) {
  const [filter, setFilter] = useState("all");
  const approvedCount = pages.filter((p) => p.status === "approved").length;

  const visible = pages.filter((p) =>
    filter === "approved" ? p.status === "approved" : filter === "open" ? p.status !== "approved" : true,
  );

  return (
    <aside className="flex flex-col gap-3 rounded-stage bg-surface p-4 shadow-low">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg">{pages.length} Trang truyện</h2>
          <span className="text-xs text-navy/60">Chọn trang cần rà soát</span>
        </div>
        <span className="rounded-full bg-outline px-2 py-0.5 text-xs font-bold text-navy/60">{pages.length} mục</span>
      </div>

      <div className="flex items-center gap-1 rounded-full bg-outline/80 p-1" role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={`flex flex-1 items-center justify-center gap-1 rounded-full py-1 text-xs font-bold transition ${
              filter === f.value ? "bg-white shadow-low" : "text-navy/60 hover:text-navy"
            }`}
          >
            {f.value === "open" && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
            {f.label}
            {f.value === "approved" && ` (${approvedCount})`}
          </button>
        ))}
      </div>

      <div className="flex max-h-[calc(100vh-380px)] min-h-60 flex-col gap-1.5 overflow-y-auto pr-1">
        {visible.map((p) => (
          <PageItem key={p.number} page={p} active={p.number === currentNumber} locked={isLocked(p.number)} onSelect={onSelect} />
        ))}
      </div>

      <div className="pt-1">
        <button
          disabled
          title="Bắt buộc kiểm tra và tích duyệt từng trang theo quy chuẩn an toàn"
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-outline py-2.5 text-sm font-semibold text-navy/40"
        >
          <ListChecks size={16} /> Đánh dấu tất cả đạt yêu cầu
        </button>
        <p className="mt-1.5 text-center text-[11px] text-navy/60">Quy chuẩn an toàn trẻ em: Không hỗ trợ duyệt hàng loạt.</p>
      </div>
    </aside>
  );
}

export default PageNavigator;
