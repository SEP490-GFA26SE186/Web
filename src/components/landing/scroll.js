// Cuộn mượt tới một section trên Landing page (header cố định đã được bù bằng scroll-mt).
// Đang ở trang khác (vd. Chính sách) → về trang chủ kèm #id, HomePage tự cuộn tới khi mở.
export const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  else window.location.assign(`/#${id}`);
};
