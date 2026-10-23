import { create } from "zustand";

// Thông báo nhanh dùng chung toàn app: toast.success("..."), toast.error("..."), toast.info("...")
export const TOAST_DURATION = 3500;
const EXIT_MS = 200; // khớp animation toast-out trong index.css

const timers = new Map();

const useToastStore = create((set, get) => {
  const remove = (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  // Đánh dấu "đang rời" để chạy animation trượt ra, rồi mới gỡ khỏi danh sách
  const dismiss = (id) => {
    clearTimeout(timers.get(id));
    timers.delete(id);
    set((s) => ({ toasts: s.toasts.map((t) => (t.id === id ? { ...t, leaving: true } : t)) }));
    setTimeout(() => remove(id), EXIT_MS);
  };
  const schedule = (id, ms) => timers.set(id, setTimeout(() => dismiss(id), ms));

  return {
    toasts: [],
    push: (message, type = "success") => {
      const id = `${Date.now()}_${Math.random()}`;
      set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message, type, leaving: false }] }));
      schedule(id, TOAST_DURATION);
    },
    dismiss,
    // Rê chuột vào thì dừng đếm, rời ra thì đếm lại phần còn lại
    pause: (id) => {
      clearTimeout(timers.get(id));
      timers.delete(id);
    },
    resume: (id, remainingMs) => {
      if (!get().toasts.some((t) => t.id === id && !t.leaving)) return;
      schedule(id, Math.max(400, remainingMs));
    },
  };
});

export const toast = {
  success: (msg) => useToastStore.getState().push(msg, "success"),
  error: (msg) => useToastStore.getState().push(msg, "error"),
  info: (msg) => useToastStore.getState().push(msg, "info"),
};

export default useToastStore;
