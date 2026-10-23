import { Check } from "lucide-react";
import { Button } from "../../ui";

/**
 * Hàng lưu của một trang / điểm dừng: chưa sửa → chữ "Đã lưu" (không có nút mờ gây khó hiểu);
 * đã sửa → nút Lưu nổi bật + "Hoàn tác" để quay về bản đang lưu.
 */
function SaveBar({ dirty, saving, disabled, onSave, onReset, label = "Lưu" }) {
  if (!dirty && !saving) {
    return (
      <div className="flex justify-end">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-navy/40">
          <Check size={14} /> Đã lưu
        </span>
      </div>
    );
  }
  return (
    <div className="flex animate-pop-in flex-wrap items-center justify-end gap-2">
      {onReset && (
        <Button variant="ghost" size="sm" onClick={onReset} disabled={disabled || saving}>
          Hoàn tác
        </Button>
      )}
      <Button size="sm" onClick={onSave} loading={saving} disabled={disabled}>
        {label}
      </Button>
    </div>
  );
}

export default SaveBar;
