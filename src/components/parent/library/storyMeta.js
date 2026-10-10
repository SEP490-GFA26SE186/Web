// Helpers hiển thị trạng thái truyện trong tủ sách, dùng chung cho dạng lưới và danh sách.
// Dữ liệu theo bookshelf_items: readingProgress = null khi bé chưa mở truyện lần nào.

export const getReadingStatus = (story) =>
  !story.readingProgress ? "not_started" : story.readingProgress.isCompleted ? "completed" : "reading";

export const getProgressLabel = (story) => {
  const status = getReadingStatus(story);
  if (status === "completed") return { text: "Đã đọc xong", className: "text-secondary-dark font-bold" };
  if (status === "reading")
    return { text: `${story.readingProgress.progressPercentage}% Đang đọc`, className: "text-primary-dark font-bold" };
  return { text: "Chưa đọc", className: "text-navy/60" };
};

// Nút hành động chính: đọc tiếp / bắt đầu / đọc lại
export const getPrimaryAction = (story) => {
  const status = getReadingStatus(story);
  if (status === "completed") return { label: "Đọc lại", variant: "neutral", icon: "replay" };
  if (status === "reading") return { label: "Đọc tiếp", variant: "primary", icon: "book" };
  return { label: "Bắt đầu đọc", variant: "teal", icon: "book" };
};

export const actionStyles = {
  primary: "bg-primary text-white shadow-low hover:shadow-mid",
  teal: "bg-secondary text-white shadow-low hover:shadow-mid",
  neutral: "bg-surface text-navy hover:bg-outline",
};

// Màu bìa tạm khi chưa có ảnh bìa thật (cover_image_key) từ BE
const GRADIENTS = [
  "from-pink-300 via-rose-200 to-amber-100",
  "from-emerald-300 via-teal-200 to-sky-100",
  "from-indigo-400 via-purple-300 to-pink-200",
  "from-sky-300 via-cyan-200 to-emerald-100",
  "from-orange-300 via-amber-200 to-yellow-100",
  "from-violet-300 via-fuchsia-200 to-rose-100",
];

export const coverGradient = (storyId) =>
  GRADIENTS[[...storyId].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % GRADIENTS.length];
