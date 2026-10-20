import { ROUTES } from "./routes";

export const ROLES = {
  PARENT: "parent",
  SPECIALIST: "specialist",
  ADMIN: "admin",
};

// Trang đầu tiên sau khi đăng nhập theo từng vai trò
export const ROLE_HOME = {
  [ROLES.PARENT]: ROUTES.PARENT.DASHBOARD,
  [ROLES.SPECIALIST]: ROUTES.SPECIALIST.DASHBOARD,
  [ROLES.ADMIN]: ROUTES.ADMIN.DASHBOARD,
};
