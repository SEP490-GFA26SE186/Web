// Lỗi mã PIN thoát Kid Mode (auth.service.js, auth.validation.js của BE).
const PIN_FORMAT = "Mã PIN gồm 4 đến 6 chữ số";

export default {
  messages: {
    "Kid Exit PIN is already set. Use change-pin endpoint to change it.": "Tài khoản đã có mã PIN, ba mẹ dùng chức năng đổi PIN nhé",
    "Kid Exit PIN has not been set yet. Please set it first.": "Tài khoản chưa có mã PIN, ba mẹ đặt PIN trước nhé",
    "Current PIN is incorrect": "Mã PIN hiện tại chưa đúng",
    "PIN is required": "Ba mẹ nhập mã PIN nhé",
    "New PIN is required": "Ba mẹ nhập mã PIN mới nhé",
    "PIN must be between 4 and 6 numeric digits": PIN_FORMAT,
    "PIN must be 4 to 6 numeric digits": PIN_FORMAT,
    "New PIN must be between 4 and 6 numeric digits": PIN_FORMAT,
    "Current PIN must be 4 to 6 digits": PIN_FORMAT,
    "Either current PIN or account password is required to change PIN": "Ba mẹ nhập mã PIN hiện tại hoặc mật khẩu tài khoản để đổi PIN nhé",
  },
};
