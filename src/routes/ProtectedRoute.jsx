import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROLE_HOME } from "../constants/roles";
import { ROUTES } from "../constants/routes";
import useAuthStore from "../stores/authStore";
import useKidSessionStore from "../stores/kidSessionStore";

/**
 * Bảo vệ route theo đăng nhập + vai trò.
 * - Chưa đăng nhập → /login (nhớ trang đang vào để quay lại sau khi đăng nhập)
 * - Sai vai trò → về trang chủ của vai trò hiện tại
 */
function ProtectedRoute({ roles, children }) {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const inKidMode = useKidSessionStore((s) => !!s.token);

  // Đang ở Kid Mode: máy đang ở tay bé → không mở trang của người lớn cho tới khi nhập PIN.
  if (inKidMode) return <Navigate to={ROUTES.KID.BOOKSHELF} replace />;
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to={ROLE_HOME[user?.role] ?? ROUTES.HOME} replace />;
  }
  return children ?? <Outlet />;
}

export default ProtectedRoute;
