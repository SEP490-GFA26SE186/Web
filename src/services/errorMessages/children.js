// Lỗi hồ sơ bé (children.service.js của BE).
export default {
  messages: {
    "Child profile not found": "Không tìm thấy hồ sơ bé",

    // Validate form hồ sơ bé (children.validation.js)
    "Child name is required": "Ba mẹ nhập tên bé nhé",
    "Child name cannot be empty": "Ba mẹ nhập tên bé nhé",
    "Child name must not exceed 100 characters": "Tên bé tối đa 100 ký tự",
    "Birth date must be formatted as YYYY-MM-DD": "Ngày sinh chưa đúng định dạng",
    "Lookup date must be formatted as YYYY-MM-DD": "Ngày xem chưa đúng định dạng",
    "Preferred voice must not exceed 50 characters": "Giọng đọc chưa hợp lệ",
    "Appearance description must not exceed 500 characters": "Mô tả ngoại hình tối đa 500 ký tự",
    "Portrait image key must not exceed 300 characters": "Ảnh chân dung chưa hợp lệ",
    "Invalid child ID format": "Hồ sơ bé không hợp lệ",
  },
  patterns: [
    // "You have reached the maximum limit of 2 child profiles for your current plan. Please upgrade to add more children."
    [/maximum limit of (\d+) child profiles/, ([, max]) => `Gói hiện tại chỉ tạo được tối đa ${max} hồ sơ bé. Ba mẹ nâng cấp gói để thêm bé nhé`],
  ],
};
