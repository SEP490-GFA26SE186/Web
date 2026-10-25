import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Coins, Loader2 } from "lucide-react";
import Pagination from "../../common/Pagination";
import { getCreditHistory } from "../../../services/parentService";

const AI_LABELS = {
  story_text: "AI viết truyện",
  character_portrait: "Vẽ chân dung",
  scene_image: "Vẽ tranh cảnh",
  narration: "Giọng đọc",
};

/** Một dòng sổ cái → câu dễ hiểu cho phụ huynh. */
function describe(e) {
  const c = e.context;
  if (e.entryType === "credit_grant") return c?.planName ? `Cấp credit tháng — ${c.planName}` : "Cấp credit";
  if (e.entryType === "credit_expire") return "Credit tháng cũ hết hạn";
  const what = c?.kind === "ai" ? AI_LABELS[c.requestType] ?? "Dùng AI" : "Dùng AI";
  const target = c?.storyTitle ? ` “${c.storyTitle}”` : c?.characterName ? ` — ${c.characterName}` : "";
  if (e.entryType === "credit_hold") return `${what}${target}`;
  if (e.entryType === "credit_release") return `Hoàn credit: ${what.toLowerCase()}${target} không thành công`;
  return what;
}

// Lịch sử credit (sổ cái): cấp theo gói, dùng cho AI, hoàn lại khi AI lỗi, hết hạn cuối tháng.
function CreditHistory() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["billing", "credit-history", page],
    queryFn: () => getCreditHistory({ page, limit: 10 }),
    placeholderData: keepPreviousData,
  });
  if (isLoading) return <Loader2 size={24} className="animate-spin text-primary" />;
  if (!data?.entries.length) return null;

  return (
    <section className="card space-y-3 p-6">
      <h2 className="flex items-center gap-2 text-lg">
        <Coins size={20} className="text-primary" /> Lịch sử credit
      </h2>
      <ul className={`divide-y divide-outline transition-opacity ${isFetching ? "opacity-60" : ""}`}>
        {data.entries.map((e) => (
          <li key={e.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5 text-sm">
            <span className="min-w-0 flex-1">{describe(e)}</span>
            <span className="text-xs text-navy/50">{new Date(e.createdAt).toLocaleString("vi-VN")}</span>
            <span className={`w-14 text-right font-bold ${e.amount > 0 ? "text-secondary-dark" : e.amount < 0 ? "text-danger" : "text-navy/50"}`}>
              {e.amount > 0 ? `+${e.amount}` : e.amount}
            </span>
            <span className="w-16 text-right text-xs text-navy/55">còn {e.balanceAfter}</span>
          </li>
        ))}
      </ul>
      {data.pagination.totalPages > 1 && <Pagination page={page} totalPages={data.pagination.totalPages} onChange={setPage} />}
    </section>
  );
}

export default CreditHistory;
