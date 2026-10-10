// BE chưa lưu emoji đại diện cho bé (chỉ có avatar.portraitImageKey là ảnh AI) →
// chọn emoji cố định theo id để mỗi bé luôn có cùng một hình trên mọi màn.
const EMOJIS = ["🧒", "👧", "👦", "🐻", "🐰", "🦊", "🐼", "🦁"];

export const childEmoji = (child) => {
  if (!child?.id) return EMOJIS[0];
  const hash = [...child.id].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 0);
  return EMOJIS[hash % EMOJIS.length];
};

/** "2019-06-15" → "15/06/2019" */
export const formatBirthDate = (value) => (value ? new Date(`${value}T00:00:00`).toLocaleDateString("vi-VN") : "");

/** Nhãn tuổi — BE trả age = null khi chưa nhập ngày sinh */
export const ageLabel = (child) => (child?.age == null ? "Chưa có ngày sinh" : `${child.age} tuổi`);

/** Ngày "YYYY-MM-DD" lệch `days` ngày so với hôm nay theo giờ VN, khớp cột usage_date (Asia/Ho_Chi_Minh). VD -1 = hôm qua */
export const vnDateOffset = (days) =>
  new Date(Date.now() + days * 86400000).toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" });
