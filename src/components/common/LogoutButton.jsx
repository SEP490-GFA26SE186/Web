import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import useAuthStore from "../../stores/authStore";
import { toast } from "../../stores/toastStore";

function LogoutButton({ className = "" }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    queryClient.clear(); // không để dữ liệu của tài khoản cũ sót lại trong cache
    navigate(ROUTES.LOGIN, { replace: true });
    toast.info("Đã đăng xuất. Hẹn gặp lại!");
  };

  return (
    <button
      onClick={handleLogout}
      title="Đăng xuất"
      aria-label="Đăng xuất"
      className={`shrink-0 rounded-full p-1.5 text-navy/60 transition hover:bg-danger-tint hover:text-danger ${className}`}
    >
      <LogOut size={17} />
    </button>
  );
}

export default LogoutButton;
