// Lỗi phân quyền (role.middleware.js và message mặc định của ApiError.unauthorized / forbidden ở BE).
export default {
  messages: {
    Unauthorized: "Bạn cần đăng nhập để tiếp tục",
    "Authentication required": "Bạn cần đăng nhập để tiếp tục",
    Forbidden: "Bạn không có quyền thực hiện thao tác này",
    "You do not have permission to access this resource": "Tài khoản của bạn không có quyền vào mục này",
  },
};
