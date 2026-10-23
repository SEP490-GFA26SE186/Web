import { ChevronLeft, ChevronRight } from "lucide-react";

// Trả về danh sách số trang, rút gọn bằng "…" khi quá nhiều trang
const getPages = (page, totalPages) => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ["…", p] : [p]));
};

function Pagination({ page, totalPages, onChange }) {
  const navBtn =
    "grid h-9 w-9 cursor-pointer place-items-center rounded-full border-[1.5px] border-navy/12 bg-white text-navy/70 transition hover:border-primary/50 hover:text-primary-dark active:scale-95 disabled:pointer-events-none disabled:opacity-35";

  return (
    <nav className="flex items-center gap-1" aria-label="Phân trang">
      <button type="button" className={navBtn} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Trang trước">
        <ChevronLeft size={17} />
      </button>
      {getPages(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="w-6 text-center text-navy/40">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`grid h-9 min-w-9 cursor-pointer place-items-center rounded-full px-2 text-sm tabular-nums transition active:scale-95 ${
              p === page ? "bg-primary font-bold text-white shadow-low" : "font-semibold text-navy/70 hover:bg-navy/[0.05] hover:text-navy"
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className={navBtn} disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Trang sau">
        <ChevronRight size={17} />
      </button>
    </nav>
  );
}

/** Chân danh sách: "Hiển thị 11–20 trong 36 mẫu" + số trang. Chỉ hiện khi có hơn một trang. */
export function PaginationBar({ page, totalPages, from, to, total, unit = "mục", onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-navy/[0.06] px-5 py-3 sm:flex-row">
      <p className="text-sm text-navy/55 tabular-nums">
        Hiển thị <span className="font-semibold text-navy">{from}–{to}</span> trong {total} {unit}
      </p>
      <Pagination page={page} totalPages={totalPages} onChange={onChange} />
    </div>
  );
}

export default Pagination;
