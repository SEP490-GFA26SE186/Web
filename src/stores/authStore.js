import { create } from "zustand";

const STORAGE_KEY = "sw_auth";

// "Ghi nhớ" → localStorage (giữ sau khi đóng trình duyệt); không ghi nhớ → sessionStorage
const readSession = () => {
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    const raw = local ?? sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...JSON.parse(raw), remember: local !== null } : null;
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

const writeSession = ({ user, accessToken, refreshToken, remember }) => {
  clearSession();
  try {
    (remember ? localStorage : sessionStorage).setItem(STORAGE_KEY, JSON.stringify({ user, accessToken, refreshToken }));
  } catch {
    // vẫn đăng nhập được trong phiên hiện tại dù không lưu được
  }
};

const saved = readSession();

const useAuthStore = create((set, get) => ({
  user: saved?.user ?? null,
  accessToken: saved?.accessToken ?? null,
  refreshToken: saved?.refreshToken ?? null,
  remember: saved?.remember ?? true,
  isAuthenticated: !!saved?.accessToken,

  /** Lưu phiên từ response BE: { user, tokens: { accessToken, refreshToken } } */
  login: ({ user, tokens }, remember = true) => {
    const session = { user, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, remember };
    writeSession(session);
    set({ ...session, isAuthenticated: true });
  },

  /** Sau khi refresh-tokens: BE xoay vòng cả 2 token */
  setTokens: ({ accessToken, refreshToken }) => {
    const next = { ...get(), accessToken, refreshToken };
    writeSession(next);
    set({ accessToken, refreshToken });
  },

  /** Đồng bộ thông tin user mới nhất từ GET /auth/me */
  setUser: (user) => {
    writeSession({ ...get(), user });
    set({ user });
  },

  logout: () => {
    clearSession();
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
