import { useState } from "react";
import { Loader2 } from "lucide-react";
import DateInput from "../../common/DateInput";
import Modal from "../../common/Modal";
import { isoToViDate, parseViDate, toIsoDate } from "../../../utils/date";

const today = toIsoDate(new Date());
const minDate = `${new Date().getFullYear() - 12}-01-01`;

/** Kiểm tra ngày sinh gõ tay; trả về thông báo lỗi hoặc "" nếu hợp lệ */
const validateBirthDate = (text) => {
  if (!text) return "Ba mẹ nhập ngày sinh của bé nhé";
  const iso = parseViDate(text);
  if (!iso) return "Ngày sinh chưa đúng, ba mẹ nhập theo dạng dd/mm/yyyy (VD 10/05/2020)";
  if (iso > today) return "Ngày sinh không được sau hôm nay";
  if (iso < minDate) return `Ngày sinh phải từ ${isoToViDate(minDate)} trở đi (bé tối đa 12 tuổi)`;
  return "";
};

const inputClass =
  "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-3 outline-none transition placeholder:text-navy/40 focus:border-secondary focus:ring-[3px] focus:ring-secondary/15";

// Dùng cho cả Thêm bé mới và Sửa hồ sơ bé (khi truyền `child`). Field khớp children.validation.js của BE
function ChildFormModal({ open, onClose, child, onSubmit, isPending, error: serverError }) {
  const [form, setForm] = useState(() => ({
    name: child?.name ?? "",
    birthDate: isoToViDate(child?.birthDate), // hiển thị "dd/mm/yyyy", đổi sang "YYYY-MM-DD" khi gửi BE
    appearance: child?.character?.appearance ?? "",
  }));
  const [error, setError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError("");
  };

  const setBirthDate = (text) => {
    setForm((f) => ({ ...f, birthDate: text }));
    setBirthDateError("");
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Ba mẹ nhập tên gọi của bé nhé");
    const dateError = validateBirthDate(form.birthDate);
    if (dateError) return setBirthDateError(dateError);
    setError("");
    const appearance = form.appearance.trim();
    onSubmit({
      name: form.name.trim(),
      birthDate: parseViDate(form.birthDate),
      // Sửa hồ sơ: gửi null để xóa mô tả; tạo mới: bỏ trống thì không gửi
      appearance: appearance || (child ? null : undefined),
    });
  };

  const message = error || serverError;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={child ? `Sửa hồ sơ ${child.name}` : "Thêm hồ sơ bé mới"}
      description="Thông tin giúp AI chọn truyện phù hợp với độ tuổi của bé"
      footer={
        <>
          <button type="button" onClick={onClose} className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold hover:bg-outline">
            Hủy
          </button>
          <button type="submit" form="child-form" disabled={isPending} className="btn-primary py-2.5 text-sm disabled:opacity-70">
            {isPending && <Loader2 size={16} className="animate-spin" />}
            {child ? "Lưu thông tin" : "Tạo hồ sơ"}
          </button>
        </>
      }
    >
      <form id="child-form" onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Tên gọi ở nhà</span>
          <input value={form.name} onChange={set("name")} maxLength={100} placeholder="Ví dụ: Bé Bi" className={inputClass} />
        </label>
        <div>
          <label htmlFor="child-birth-date" className="mb-1.5 block text-sm font-semibold">
            Ngày sinh
          </label>
          <DateInput
            id="child-birth-date"
            value={form.birthDate}
            onChange={setBirthDate}
            // Gõ xong rời ô mới báo lỗi, tránh báo khi đang gõ dở
            onBlur={() => form.birthDate && setBirthDateError(validateBirthDate(form.birthDate))}
            min={minDate}
            max={today}
            aria-invalid={!!birthDateError}
            aria-describedby={birthDateError ? "child-birth-date-error" : "child-birth-date-hint"}
            className={`${inputClass} ${birthDateError ? "border-danger focus:border-danger focus:ring-danger/15" : ""}`}
          />
          {birthDateError ? (
            <p id="child-birth-date-error" className="mt-1 text-xs font-semibold text-red-600">
              {birthDateError}
            </p>
          ) : (
            <p id="child-birth-date-hint" className="mt-1 text-xs text-navy/50">
              Gõ ngày dạng dd/mm/yyyy hoặc bấm biểu tượng lịch để chọn
            </p>
          )}
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">
            Ngoại hình của bé <span className="font-normal text-navy/50">(không bắt buộc)</span>
          </span>
          <textarea
            value={form.appearance}
            onChange={set("appearance")}
            maxLength={500}
            rows={3}
            placeholder="Ví dụ: tóc ngắn xoăn, má phúng phính, hay mặc áo khủng long xanh"
            className={`${inputClass} resize-none`}
          />
          <span className="mt-1 block text-xs text-navy/50">AI dùng mô tả này để vẽ bé thành nhân vật chính trong truyện</span>
        </label>
        {message && <p className="text-sm font-semibold text-red-600">{message}</p>}
      </form>
    </Modal>
  );
}

export default ChildFormModal;
