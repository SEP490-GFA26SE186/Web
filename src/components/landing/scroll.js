// Cuộn mượt tới một section trên Landing page (header cố định đã được bù bằng scroll-mt)
export const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
