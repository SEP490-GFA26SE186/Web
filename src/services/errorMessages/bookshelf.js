// Lỗi giá sách của bé (bookshelf.service.js, bookshelf.validation.js của BE).
const PICK_CHILD = "Ba mẹ chọn bé trước nhé";
const BAD_PAGE = "Số trang chưa hợp lệ";

export default {
  messages: {
    "Child ID is required": PICK_CHILD,
    "Child ID query parameter is required": PICK_CHILD,
    "Child profile not found or access denied": "Không tìm thấy hồ sơ bé trong tài khoản này",
    "Story ID is required": "Ba mẹ chọn truyện trước nhé",
    "Invalid story ID format": "Truyện không hợp lệ",
    "Page must be an integer": BAD_PAGE,
    "Limit must be an integer": BAD_PAGE,
  },
};
