import { create } from "zustand";

// Lưu hồ sơ bé đang được chọn trên thanh header của Parent.
const useParentStore = create((set) => ({
  selectedChildId: "c_001",
  setSelectedChildId: (selectedChildId) => set({ selectedChildId }),
}));

export default useParentStore;
