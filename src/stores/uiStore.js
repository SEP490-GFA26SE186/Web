import { create } from "zustand";

const KEY = "sw_sidebar_collapsed";

const read = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

// Trạng thái giao diện dùng chung cho mọi khung (phụ huynh / kiểm duyệt / admin): sidebar thu gọn trên desktop.
// Nhớ qua lần mở sau; trình duyệt chặn storage thì chỉ giữ trong phiên.
const useUiStore = create((set) => ({
  sidebarCollapsed: read(),
  toggleSidebar: () =>
    set((s) => {
      const next = !s.sidebarCollapsed;
      try {
        localStorage.setItem(KEY, next ? "1" : "0");
      } catch {
        // bỏ qua
      }
      return { sidebarCollapsed: next };
    }),
}));

export default useUiStore;
