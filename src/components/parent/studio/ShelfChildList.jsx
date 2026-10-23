import { Check } from "lucide-react";
import { Button } from "../../ui";

/**
 * Danh sách bé + trạng thái truyện trên giá sách của từng bé. Mỗi bé một hàng: chưa có → nút "Đưa lên giá"
 * (rõ là hành động); đã có → nhãn "Đã có trên giá" + nút chữ "Bỏ khỏi giá" (hành động ngược, nhẹ hơn).
 * kids: [{ childId, name, inBookshelf }] • busyId: bé đang xử lý • onToggle(child)
 */
function ShelfChildList({ kids, busyId, onToggle }) {
  return (
    <ul className="divide-y divide-navy/[0.06] overflow-hidden rounded-2xl border border-navy/[0.08]">
      {kids.map((child) => {
        const busy = busyId === child.childId;
        return (
          <li key={child.childId} className="flex flex-wrap items-center gap-3 bg-white px-4 py-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary-tint font-display font-bold text-secondary-dark">
              {child.name?.[0]?.toUpperCase() ?? "?"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{child.name}</p>
              {child.inBookshelf ? (
                <p className="flex items-center gap-1 text-xs font-semibold text-secondary-dark">
                  <Check size={13} strokeWidth={3} /> Đã có trên giá sách
                </p>
              ) : (
                <p className="text-xs text-navy/50">Chưa có trên giá sách</p>
              )}
            </div>
            {child.inBookshelf ? (
              <Button variant="ghost" size="sm" loading={busy} onClick={() => onToggle(child)}>
                Bỏ khỏi giá
              </Button>
            ) : (
              <Button size="sm" loading={busy} onClick={() => onToggle(child)}>
                Đưa lên giá
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default ShelfChildList;
