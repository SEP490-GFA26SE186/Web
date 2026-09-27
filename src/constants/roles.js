import { ROUTES } from "./routes";

export const ROLES = {
  PARENT: "parent",
  MODERATOR: "moderator",
  ADMIN: "admin",
};

// Trang đầu tiên sau khi đăng nhập theo từng vai trò
export const ROLE_HOME = {
  [ROLES.PARENT]: ROUTES.PARENT.DASHBOARD,
  [ROLES.MODERATOR]: ROUTES.MODERATOR.DASHBOARD,
  [ROLES.ADMIN]: ROUTES.ADMIN.DASHBOARD,
};
