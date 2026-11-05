// Lỗi trang quản trị: âm thanh giao diện của Kid Mode (content-library.service.js, content-library.validation.js của BE).
export default {
  messages: {
    "UI Audio asset not found": "Không tìm thấy âm thanh này, có thể đã bị xoá",
    "Invalid audio asset ID format": "Âm thanh không hợp lệ",
    "Audio asset key is required": "Nhập mã âm thanh",
    "Audio key cannot be empty": "Nhập mã âm thanh",
    "Key cannot be empty": "Nhập mã âm thanh",
    "Audio key must not exceed 300 characters": "Mã âm thanh tối đa 300 ký tự",
    "Key must not exceed 80 characters": "Mã âm thanh tối đa 80 ký tự",
    "Audio storage key is required": "Chưa có tệp âm thanh",
    "Text content is required": "Nhập nội dung câu đọc",
  },
  patterns: [
    // "UI Audio asset with key 'tap_start' and lang 'vi' not found"
    [/^UI Audio asset with key '(.+)' and lang '(.+)' not found$/, ([, key, lang]) => `Không tìm thấy âm thanh "${key}" (${lang})`],
    // "UI Audio asset with key 'tap_start' and language 'vi' already exists"
    [/^UI Audio asset with key '(.+)' and language '(.+)' already exists$/, ([, key, lang]) => `Âm thanh "${key}" (${lang}) đã có rồi`],
  ],
};
