import { useRef } from "react";
import { CalendarDays } from "lucide-react";
import { isoToViDate, maskViDate, parseViDate } from "../../utils/date";

/**
 * Ô nhập ngày: gõ tay "dd/mm/yyyy" hoặc bấm biểu tượng lịch để chọn.
 * value / onChange là chuỗi người dùng thấy ("dd/mm/yyyy", có thể đang gõ dở); dùng parseViDate để lấy "YYYY-MM-DD".
 * min / max: "YYYY-MM-DD", giới hạn ngày chọn được trên lịch.
 */
function DateInput({ id, value, onChange, onBlur, min, max, className = "", ...props }) {
  const pickerRef = useRef(null);

  const openPicker = () => {
    const picker = pickerRef.current;
    try {
      picker.showPicker(); // Chrome/Edge/Firefox/Safari 16+
    } catch {
      picker.focus(); // trình duyệt cũ: vẫn gõ tay được
    }
  };

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="bday"
        placeholder="dd/mm/yyyy"
        maxLength={10}
        value={value}
        onChange={(e) => onChange(maskViDate(e.target.value))}
        onBlur={onBlur}
        className={`${className} pr-12`}
        {...props}
      />
      <button
        type="button"
        onClick={openPicker}
        aria-label="Chọn ngày trên lịch"
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-2 text-navy/50 transition hover:bg-surface hover:text-secondary-dark"
      >
        <CalendarDays size={18} />
      </button>
      {/* Date picker gốc của trình duyệt, ẩn đi — chỉ mở qua nút lịch; đặt ở góc phải để lịch bật ra cạnh ô nhập */}
      <input
        ref={pickerRef}
        type="date"
        tabIndex={-1}
        aria-hidden="true"
        min={min}
        max={max}
        value={parseViDate(value) ?? ""}
        onChange={(e) => onChange(isoToViDate(e.target.value))}
        className="pointer-events-none absolute right-0 bottom-0 h-px w-px opacity-0"
      />
    </div>
  );
}

export default DateInput;
