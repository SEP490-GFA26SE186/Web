import { create } from "zustand";

// Thông báo nhanh dùng chung toàn app: toast.success("..."), toast.error("..."), toast.info("...")
const useToastStore = create((set) => ({
  toasts: [],
  push: (message, type = "success") => {
    const id = `${Date.now()}_${Math.random()}`;
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message, type }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3500);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (msg) => useToastStore.getState().push(msg, "success"),
  error: (msg) => useToastStore.getState().push(msg, "error"),
  info: (msg) => useToastStore.getState().push(msg, "info"),
};

export default useToastStore;
