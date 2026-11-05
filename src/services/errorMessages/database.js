// Lỗi Prisma / Postgres đã được BE đổi sang 4xx (src/utils/prismaError.js của BE): trùng dữ liệu, xung đột ghi, thiếu trường…
export default {
  messages: {
    "Resource already exists": "Dữ liệu này đã tồn tại",
    "Related resource does not exist or is still referenced": "Dữ liệu liên quan không còn tồn tại hoặc vẫn đang được dùng ở nơi khác",
    "A provided value is too long for its column": "Có thông tin nhập vào dài quá, rút gọn lại giúp mình nhé",
    "Write conflict, please retry": "Hệ thống đang bận xử lý dữ liệu này, thử lại sau giây lát nhé",
    "Operation not allowed by a database rule": "Thao tác này không được phép",
    "A required field is missing": "Còn thiếu thông tin bắt buộc",
    "Data violates a database constraint": "Dữ liệu chưa hợp lệ",
  },
  patterns: [
    // P2002 kèm tên cột: "Resource already exists: email"
    [/^Resource already exists: .+$/, "Dữ liệu này đã tồn tại"],
    // Vi phạm CHECK kèm tên constraint: "Data violates constraint wallets_balance_check"
    [/^Data violates constraint \S+$/, "Dữ liệu chưa hợp lệ"],
  ],
};
