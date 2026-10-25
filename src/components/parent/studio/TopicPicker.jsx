import { useMemo, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import Switch from "../../common/Switch";
import { CASEL } from "../../../constants/casel";
import CaselTag from "../library/CaselTag";
import { Button, ChoiceCard, EmptyState, SegmentedControl } from "../../ui";

// Số chuyện mẫu hiện trước; còn lại mở bằng "Xem thêm" để danh sách dài không đẩy các bước sau xuống quá xa
const PAGE = 6;

const fold = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase();

const fitsAge = (t, age) => age == null || (t.ageMin <= age && age <= t.ageMax);

/**
 * Chọn chuyện mẫu khi tạo truyện — chịu được danh sách dài (vài chục chuyện):
 * tìm theo tên (không dấu cũng được), lọc theo năng lực CASEL (kèm số lượng), lọc hợp tuổi bé đang chọn,
 * hiện trước PAGE chuyện + "Xem thêm", dải "Đã chọn" luôn hiện kể cả khi chuyện đã chọn bị lọc ẩn.
 * allowNone: thêm lựa chọn "Không chọn chuyện mẫu" (truyện tự viết).
 */
function TopicPicker({ topics, value, onChange, childAge, childName, allowNone = false }) {
  const [query, setQuery] = useState("");
  const [competency, setCompetency] = useState("all");
  const [fitAge, setFitAge] = useState(childAge != null);
  const [expanded, setExpanded] = useState(false);

  const fits = (t) => fitsAge(t, childAge);

  // Đếm theo năng lực sau khi đã lọc tìm kiếm + tuổi, để con số khớp với những gì sẽ thấy
  const base = useMemo(() => {
    const q = fold(query.trim());
    return topics.filter((t) => (!q || fold(t.title).includes(q)) && (!fitAge || fitsAge(t, childAge)));
  }, [topics, query, fitAge, childAge]);

  const counts = useMemo(() => {
    const c = {};
    for (const t of base) c[t.skill?.caselCode] = (c[t.skill?.caselCode] ?? 0) + 1;
    return c;
  }, [base]);

  const results = competency === "all" ? base : base.filter((t) => t.skill?.caselCode === competency);
  const shown = expanded ? results : results.slice(0, PAGE);
  const hiddenCount = results.length - shown.length;
  const selected = topics.find((t) => t.id === value);
  const filtering = query.trim() || competency !== "all" || fitAge;

  const reset = () => {
    setQuery("");
    setCompetency("all");
    setFitAge(false);
    setExpanded(false);
  };
  // Đổi bộ lọc thì thu lại danh sách
  const withCollapse = (fn) => (v) => {
    fn(v);
    setExpanded(false);
  };

  const tabs = [
    { value: "all", label: `Tất cả (${base.length})` },
    ...Object.entries(CASEL)
      .filter(([code]) => counts[code])
      .map(([code, meta]) => ({ value: code, label: `${meta.short} (${counts[code]})` })),
  ];

  return (
    <div className="space-y-4">
      {/* Đã chọn: luôn hiện để không "mất dấu" khi bộ lọc che chuyện đang chọn */}
      {selected && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border-[1.5px] border-primary bg-primary-tint/50 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-primary-dark">Đã chọn</p>
            <p className="truncate font-display font-bold">{selected.title}</p>
          </div>
          <CaselTag competency={selected.skill?.caselCode} className="bg-white" short />
          {allowNone && (
            <Button variant="ghost" size="sm" onClick={() => onChange(null)}>
              Bỏ chọn
            </Button>
          )}
        </div>
      )}

      {/* Bộ lọc */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Tìm chuyện mẫu</span>
            <Search size={17} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-navy/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => withCollapse(setQuery)(e.target.value)}
              placeholder="Tìm chuyện mẫu theo tên…"
              className="h-11 w-full rounded-full border-[1.5px] border-outline bg-white pr-10 pl-11 text-sm outline-none transition placeholder:text-navy/40 hover:border-navy/20 focus:border-secondary focus:ring-[3px] focus:ring-secondary/15"
            />
            {query && (
              <button
                type="button"
                onClick={() => withCollapse(setQuery)("")}
                aria-label="Xoá tìm kiếm"
                className="absolute top-1/2 right-2.5 grid h-7 w-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-navy/40 hover:bg-navy/[0.06] hover:text-navy"
              >
                <X size={15} />
              </button>
            )}
          </label>
          {childAge != null && (
            <label className="flex shrink-0 cursor-pointer items-center gap-2.5 rounded-full border-[1.5px] border-outline bg-white py-1.5 pr-2 pl-4 text-sm font-semibold">
              Hợp tuổi {childName ?? "bé"} ({childAge} tuổi)
              <Switch checked={fitAge} onChange={withCollapse(setFitAge)} label={`Chỉ hiện chuyện mẫu hợp ${childAge} tuổi`} />
            </label>
          )}
        </div>
        {tabs.length > 2 && <SegmentedControl value={competency} onChange={withCollapse(setCompetency)} items={tabs} label="Lọc theo năng lực" size="sm" />}
      </div>

      {/* Kết quả */}
      {results.length === 0 && !allowNone ? (
        <EmptyState
          compact
          icon={Search}
          title="Không có chuyện mẫu phù hợp"
          description={fitAge ? "Thử tắt lọc theo tuổi hoặc tìm bằng từ khác." : "Thử tìm bằng từ khác."}
          action={
            <Button variant="secondary" size="sm" onClick={reset}>
              Xoá bộ lọc
            </Button>
          }
          className="rounded-2xl border border-dashed border-navy/15"
        />
      ) : (
        <div role="radiogroup" aria-label="Chuyện mẫu" className="grid gap-3 sm:grid-cols-2">
          {allowNone && !query.trim() && (
            <ChoiceCard
              compact
              selected={!value}
              onClick={() => onChange(null)}
              title="Không chọn chuyện mẫu"
              description="Truyện tự viết không tính vào báo cáo EQ."
            />
          )}
          {shown.map((t) => (
            <ChoiceCard
              key={t.id}
              compact
              selected={value === t.id}
              onClick={() => onChange(t.id)}
              aria-label={`Chuyện mẫu: ${t.title}`}
              leading={<CaselTag competency={t.skill?.caselCode} className="bg-secondary-tint" short />}
              title={t.title}
              footer={
                <span className={fits(t) ? "font-normal text-navy/55" : "text-primary-dark"}>
                  {t.ageMin}–{t.ageMax} tuổi
                  {!fits(t) && " · lệch tuổi của bé"}
                </span>
              }
            />
          ))}
        </div>
      )}

      {(hiddenCount > 0 || (expanded && results.length > PAGE)) && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-navy/50">
            Đang hiện {shown.length}/{results.length} chuyện mẫu{filtering ? " phù hợp bộ lọc" : ""}
          </p>
          <Button variant="secondary" size="sm" iconRight={ChevronDown} onClick={() => setExpanded((v) => !v)} className={expanded ? "[&_svg]:rotate-180" : ""}>
            {expanded ? "Thu gọn" : `Xem thêm ${hiddenCount} chuyện mẫu`}
          </Button>
        </div>
      )}
    </div>
  );
}

export default TopicPicker;
