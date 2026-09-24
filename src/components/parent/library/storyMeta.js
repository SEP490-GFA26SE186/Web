// Helpers hiển thị trạng thái truyện, dùng chung cho dạng lưới và danh sách.

export const getProgressLabel = (story) => {
  if (story.status === "completed") return { text: "100% Hoàn thành", className: "text-secondary-dark font-bold" };
  if (story.status === "reading") return { text: `${story.progress}% Đang đọc`, className: "text-primary-dark font-bold" };
  return { text: story.isNew ? "Mới" : "Chưa bắt đầu", className: "text-navy/60" };
};

// Nút hành động chính: đọc tiếp / bắt đầu / đọc lại
export const getPrimaryAction = (story) => {
  if (story.status === "completed") return { label: "Đọc lại", variant: "neutral", icon: "replay" };
  if (story.status === "reading" || story.isNew) return { label: "Mở sách", variant: "primary", icon: "book" };
  if (story.isBedtime) return { label: "Bắt đầu đọc", variant: "teal", icon: "stories" };
  return { label: "Mở sách", variant: "neutral", icon: "book" };
};

export const actionStyles = {
  primary: "bg-primary text-white shadow-low hover:shadow-mid",
  teal: "bg-secondary text-white shadow-low hover:shadow-mid",
  neutral: "bg-surface text-navy hover:bg-outline",
};
