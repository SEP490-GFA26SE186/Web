import { create } from "zustand";

// Phiên Kid Mode (POST /auth/kid-mode/enter): token riêng của bé + bé đang dùng máy.
// Lưu localStorage để tải lại trang vẫn ở Kid Mode; chỉ thoát được bằng PIN của ba mẹ.
const STORAGE_KEY = "sw_kid_session";

const read = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const write = (value) => {
  try {
    if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // trình duyệt chặn storage: vẫn dùng được trong lần mở trang này
  }
};

const initial = read();

const useKidSessionStore = create((set) => ({
  token: initial?.token ?? null,
  child: initial?.child ?? null,
  start: (token, child) => {
    write({ token, child });
    set({ token, child });
  },
  end: () => {
    write(null);
    set({ token: null, child: null });
  },
}));

export const isInKidMode = () => !!useKidSessionStore.getState().token;

export default useKidSessionStore;
