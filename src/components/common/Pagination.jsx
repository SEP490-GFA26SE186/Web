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
    "grid h-10 w-10 place-items-center rounded-full bg-surface text-navy/70 transition hover:bg-outline disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav className="flex items-center gap-1.5" aria-label="Phân trang">
      <button className={navBtn} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Trang trước">
        <ChevronLeft size={18} />
      </button>
      {getPages(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-navy/40">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`grid h-10 w-10 place-items-center rounded-full text-sm transition ${
              p === page ? "bg-primary font-bold text-white shadow-low" : "font-semibold hover:bg-surface"
            }`}
          >
            {p}
          </button>
        ),
      )}
      <button className={navBtn} disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Trang sau">
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}

export default Pagination;
