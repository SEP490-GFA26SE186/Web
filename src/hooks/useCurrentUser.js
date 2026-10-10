import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/authService";
import useAuthStore from "../stores/authStore";

/**
 * Đồng bộ user từ GET /auth/me khi đã đăng nhập (vai trò, tên... có thể đổi ở BE sau lần đăng nhập trước).
 * Token hỏng thì interceptor của api.js tự refresh / đăng xuất.
 */
export const useCurrentUser = () => {
  const { isAuthenticated, user, setUser } = useAuthStore();

  const query = useQuery({
    // Gắn id vào key: đăng nhập tài khoản khác không bị dùng lại dữ liệu cache của tài khoản cũ
    queryKey: ["auth", "me", user?.id],
    queryFn: getMe,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (query.data) setUser(query.data);
  }, [query.data, setUser]);

  return { user, isLoading: query.isLoading };
};
