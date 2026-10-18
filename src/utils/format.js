// Định dạng số liệu hiển thị theo chuẩn Việt Nam

export const formatVND = (n) => `${Math.round(n).toLocaleString("vi-VN")} đ`;

export const formatNumber = (n) => n.toLocaleString("vi-VN");

// ISO time → "hôm nay" / "hôm qua" / "3 ngày trước" / "12/09/2026"
export const formatRelativeDay = (iso) => {
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const date = new Date(iso);
  const days = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86400000);
  if (days <= 0) return "hôm nay";
  if (days === 1) return "hôm qua";
  if (days < 7) return `${days} ngày trước`;
  return date.toLocaleDateString("vi-VN");
};

// Tải một mảng hàng ra file CSV (có BOM để Excel đọc đúng tiếng Việt)
export const downloadCsv = (filename, rows) => {
  const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = rows.map((r) => r.map(escape).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
