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

// Ảnh bìa của truyện / bản đăng bán: BE trả `cover: { imageUrl, competency }` (ảnh = tranh một cảnh, mặc định cảnh 1).
// Đối tượng cũ chưa có `cover` → lấy coverImageUrl (nếu có) và năng lực của bài học để vẽ bìa dự phòng.
export const coverOf = (item) =>
  item?.cover ?? { imageUrl: item?.coverImageUrl ?? null, competency: item?.topic?.competency ?? null };
