// Định dạng số liệu hiển thị theo chuẩn Việt Nam

export const formatVND = (n) => `${Math.round(n).toLocaleString("vi-VN")} đ`;

export const formatNumber = (n) => n.toLocaleString("vi-VN");

// 482600000 → "482.6M", 96520000 → "96.52M"
export const formatMillions = (n, digits = 2) =>
  `${Number((n / 1_000_000).toFixed(digits)).toLocaleString("en-US", { maximumFractionDigits: digits })}M`;

export const formatPercent = (n, digits = 1) => `${Number(n.toFixed(digits))}%`;

// 45 → "45p trước", 130 → "2h trước"
export const formatAgo = (minutes) =>
  minutes < 60 ? `${minutes}p trước` : minutes < 1440 ? `${Math.floor(minutes / 60)}h trước` : `${Math.floor(minutes / 1440)} ngày trước`;

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

// 195 → "3h15m", 240 → "4h"
export const formatDuration = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}m`;
  return m ? `${h}h${m}m` : `${h}h`;
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
