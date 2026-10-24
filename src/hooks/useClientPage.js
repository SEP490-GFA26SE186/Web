import { useState } from "react";

/**
 * Phân trang phía trình duyệt cho danh sách BE trả về đủ một lần (mẫu câu hỏi, chuyện mẫu…).
 * resetKey: đổi bộ lọc / tìm kiếm thì truyền giá trị khác → tự về trang 1.
 * Trả về { page, setPage, totalPages, pageItems, from, to, total }.
 */
export default function useClientPage(items, pageSize = 10, resetKey = "") {
  const [page, setPage] = useState(1);
  const [key, setKey] = useState(resetKey);
  // Điều chỉnh state ngay lúc render khi bộ lọc đổi (không cần effect, không nháy trang cũ)
  if (key !== resetKey) {
    setKey(resetKey);
    setPage(1);
  }
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, totalPages); // xoá mục cuối của trang cuối → lùi về trang trước
  const start = (current - 1) * pageSize;
  return {
    page: current,
    setPage,
    totalPages,
    pageItems: items.slice(start, start + pageSize),
    from: total ? start + 1 : 0,
    to: Math.min(start + pageSize, total),
    total,
  };
}
