// Lỗi phiên đăng nhập / token (auth.middleware.js, token.service.js của BE).
const SIGN_IN_AGAIN = "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại";

export default {
  messages: {
    "Access token is missing": "Bạn cần đăng nhập để tiếp tục",
    "Invalid or expired access token": SIGN_IN_AGAIN,
    "Invalid or already used refresh token": SIGN_IN_AGAIN,
    "Refresh token has expired": SIGN_IN_AGAIN,
    "Refresh token is required": SIGN_IN_AGAIN,
    "User not found or deactivated": "Tài khoản không tồn tại hoặc đã bị khoá",
    "User not found": "Không tìm thấy tài khoản",
    "Parent account not found": "Không tìm thấy tài khoản phụ huynh",
  },
};
