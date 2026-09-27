import { create } from "zustand";

const STORAGE_KEY = "sw_auth";

// "Ghi nhớ" → localStorage (giữ sau khi đóng trình duyệt); không ghi nhớ → sessionStorage
const readSession = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const clearSession = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // bỏ qua: trình duyệt chặn storage
  }
};

const saved = readSession();

const useAuthStore = create((set) => ({
  user: saved?.user ?? null,
  token: saved?.token ?? null,
  isAuthenticated: !!saved?.token,

  login: ({ user, token }, remember = true) => {
    clearSession();
    try {
      (remember ? localStorage : sessionStorage).setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    } catch {
      // vẫn đăng nhập được trong phiên hiện tại dù không lưu được
    }
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    clearSession();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
