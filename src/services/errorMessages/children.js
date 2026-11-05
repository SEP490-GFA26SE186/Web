// Lỗi hồ sơ bé (children.service.js của BE).
export default {
  messages: {
    "Child profile not found": "Không tìm thấy hồ sơ bé",
  },
  patterns: [
    // "You have reached the maximum limit of 2 child profiles for your current plan. Please upgrade to add more children."
    [/maximum limit of (\d+) child profiles/, ([, max]) => `Gói hiện tại chỉ tạo được tối đa ${max} hồ sơ bé. Ba mẹ nâng cấp gói để thêm bé nhé`],
  ],
};
