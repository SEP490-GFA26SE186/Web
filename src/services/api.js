import axios from "axios";
import useAuthStore from "../stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự gắn token đăng nhập vào mọi request
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token hết hạn / không hợp lệ → đăng xuất để ProtectedRoute đưa về trang đăng nhập
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) useAuthStore.getState().logout();
    return Promise.reject(error);
  },
);

export default api;
