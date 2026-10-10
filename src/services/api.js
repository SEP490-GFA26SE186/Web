import axios from "axios";
import useAuthStore from "../stores/authStore";

const baseURL = import.meta.env.VITE_API_URL || "/api/v1";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Instance riêng để gọi refresh — không đi qua interceptor bên dưới, tránh vòng lặp 401
const refreshClient = axios.create({ baseURL, headers: { "Content-Type": "application/json" } });

// Các endpoint auth tự xử lý 401 của chính nó (sai mật khẩu, refresh token hỏng...)
const NO_REFRESH_URLS = ["/auth/login", "/auth/register", "/auth/refresh-tokens", "/auth/logout"];

// Tự gắn access token vào mọi request
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Nhiều request cùng 401 một lúc chỉ refresh một lần (BE xoay vòng refresh token, dùng lại token cũ sẽ bị từ chối)
let refreshing = null;

const refreshAccessToken = () => {
  if (!refreshing) {
    const { refreshToken, setTokens } = useAuthStore.getState();
    refreshing = (
      refreshToken
        ? refreshClient.post("/auth/refresh-tokens", { refreshToken }).then(({ data }) => {
            setTokens(data.data.tokens);
            return data.data.tokens.accessToken;
          })
        : Promise.reject(new Error("Missing refresh token"))
    ).finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
};

// Access token hết hạn → refresh rồi gửi lại request; refresh thất bại → đăng xuất để ProtectedRoute đưa về trang đăng nhập
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const skip = !original || original._retry || NO_REFRESH_URLS.some((url) => original.url?.startsWith(url));

    if (error.response?.status !== 401 || skip) return Promise.reject(error);

    original._retry = true;
    try {
      const accessToken = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }
  },
);

/** Lấy thông báo lỗi từ response BE: { success: false, message, errors?: [{ path, message }] } */
export const getErrorMessage = (error, fallback = "Có lỗi xảy ra, ba mẹ thử lại sau nhé") => {
  if (!error.response) return error.message === "Network Error" ? "Không kết nối được máy chủ, ba mẹ kiểm tra mạng nhé" : error.message || fallback;
  // Lỗi 5xx là lỗi máy chủ (VD thông báo Prisma) → không hiện chi tiết kỹ thuật cho người dùng
  if (error.response.status >= 500) return fallback;
  const { message, errors } = error.response.data ?? {};
  return errors?.[0]?.message || message || fallback;
};

export default api;
