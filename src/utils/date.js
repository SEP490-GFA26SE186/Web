// Chuyển đổi giữa ngày người dùng gõ "dd/mm/yyyy" và định dạng "YYYY-MM-DD" BE/input[type=date] dùng.

const pad = (n) => String(n).padStart(2, "0");

/** Ngày theo giờ máy người dùng (không dùng toISOString vì lệch ngày theo UTC lúc sáng sớm ở VN) */
export const toIsoDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** "2020-05-10" → "10/05/2020" */
export const isoToViDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

/** Tự chèn "/" khi gõ: "10052020" → "10/05/2020". Không thêm "/" ở cuối để xóa lùi không bị kẹt */
export const maskViDate = (text) => {
  const digits = text.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join("/");
};

/** "10/05/2020" (cho phép "1/5/2020") → "2020-05-10"; ngày không tồn tại (VD 31/02) → null */
export const parseViDate = (text) => {
  const match = text.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [day, month, year] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return toIsoDate(date);
};
