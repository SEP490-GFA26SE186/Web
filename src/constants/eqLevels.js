// Mức độ EQ theo kỹ năng con (spec sư phạm CASEL §7): không hiện điểm / % cho phụ huynh, chỉ mức.
// Thang một màu (xanh ngọc nhạt → đậm) theo thứ tự mức; luôn kèm nhãn chữ, không dùng màu đơn lẻ.
export const EQ_LEVELS = {
  emerging: { value: 1, label: "Đang làm quen", fill: "#9fdcd4", badge: "bg-secondary-tint text-secondary-dark ring-1 ring-secondary/30" },
  developing: { value: 2, label: "Đang phát triển", fill: "#00a896", badge: "bg-secondary text-white" },
  secure: { value: 3, label: "Vững", fill: "#006b5f", badge: "bg-secondary-dark text-white" },
};

export const EQ_LEVEL_ORDER = ["emerging", "developing", "secure"];

export const NO_DATA_LABEL = "Chưa có dữ liệu";

export const levelLabel = (level) => EQ_LEVELS[level]?.label ?? NO_DATA_LABEL;

export const EQ_REPORT_NOTE =
  "Báo cáo phản ánh mức hiểu của con qua tình huống trong truyện, không phải đánh giá hành vi ngoài đời.";

export const EVIDENCE_SOURCE_LABEL = { ai_template: "AI viết theo mẫu của chuyên gia" };
