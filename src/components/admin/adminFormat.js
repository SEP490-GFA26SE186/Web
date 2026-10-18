import { formatVND } from "../../utils/format";

// Hằng số / hàm định dạng dùng chung cho các trang Admin.

export const RANGES = [
  { value: "today", label: "Hôm nay" },
  { value: "7d", label: "7 ngày" },
  { value: "30d", label: "30 ngày" },
  { value: "90d", label: "90 ngày" },
  { value: "year", label: "12 tháng" },
];

export const money = (n) => formatVND(n ?? 0);
export const fieldClass = "w-full rounded-2xl border-[1.5px] border-outline bg-white px-4 py-2.5 text-sm outline-none focus:border-primary";
export const formatDateTime = (iso) => (iso ? new Date(iso).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" }) : "—");
