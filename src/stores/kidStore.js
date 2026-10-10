import { create } from "zustand";

// Tùy chọn trải nghiệm trong Chế độ Trẻ Em
const useKidStore = create((set) => ({
  muted: false, // tắt tiếng giọng đọc
  rate: 0.9, // tốc độ đọc
  autoPlay: false, // tự đọc khi sang trang (bật sau lần bé bấm nghe đầu tiên)
  parentGateOpen: false, // hộp thoại nhập PIN để thoát chế độ trẻ em
  toggleMuted: () => set((s) => ({ muted: !s.muted })),
  setRate: (rate) => set({ rate }),
  setAutoPlay: (autoPlay) => set({ autoPlay }),
  setParentGateOpen: (parentGateOpen) => set({ parentGateOpen }),
}));

export default useKidStore;
