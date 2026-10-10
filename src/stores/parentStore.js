import { create } from "zustand";

const STORAGE_KEY = "sw_selected_child";

const readSelected = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

// Lưu hồ sơ bé đang được chọn trên thanh header của Parent (nhớ qua lần mở sau).
// null / id không còn tồn tại → useSelectedChild tự lấy bé đầu tiên.
const useParentStore = create((set) => ({
  selectedChildId: readSelected(),
  setSelectedChildId: (selectedChildId) => {
    try {
      localStorage.setItem(STORAGE_KEY, selectedChildId);
    } catch {
      // bỏ qua: trình duyệt chặn storage
    }
    set({ selectedChildId });
  },
}));

export default useParentStore;
