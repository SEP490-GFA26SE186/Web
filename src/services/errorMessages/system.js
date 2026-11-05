// Lỗi chung của BE: message mặc định của ApiError, route không tồn tại, lỗi validate tổng, lỗi đọc body của express.
export default {
  messages: {
    "Route not found": "Không tìm thấy chức năng này, thử tải lại trang nhé",
    "Resource not found": "Không tìm thấy dữ liệu, có thể đã bị xoá",
    "Validation failed": "Thông tin gửi lên chưa hợp lệ, kiểm tra lại giúp mình nhé",
    "Internal server error": "Máy chủ đang gặp sự cố, thử lại sau ít phút nhé",
    "request entity too large": "Dữ liệu gửi lên quá lớn, thử rút gọn lại nhé",
  },
};
