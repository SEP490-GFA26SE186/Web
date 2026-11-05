// Message mặc định của zod v4 (BE dùng zod để validate, rule nào không ghi message riêng thì zod trả câu tiếng Anh).
// Mẫu câu lấy từ zod/v4/locales/en.js, VD "Too big: expected string to have <=500 characters".

const LIMIT_WORDS = { "<=": "tối đa", "<": "ít hơn", ">=": "ít nhất", ">": "nhiều hơn" };

// "Too big/small: expected string to have <=500 characters" | "... array to have >=1 items"
const sizeMessage = ([, origin, op, amount]) => {
  const n = Number(amount);
  if (origin === "string") {
    if (op === ">=" && n === 1) return "Không được để trống";
    return op.startsWith(">") ? `Cần ${LIMIT_WORDS[op]} ${n} ký tự` : `Nội dung dài quá, ${LIMIT_WORDS[op]} ${n} ký tự`;
  }
  if (origin === "array" || origin === "set") return `Chọn ${LIMIT_WORDS[op]} ${n} mục`;
  return `Dung lượng ${LIMIT_WORDS[op]} ${n}`;
};

// "Too big/small: expected number to be <=100"
const NUMBER_LIMIT = { "<=": "Giá trị tối đa là", "<": "Giá trị phải nhỏ hơn", ">=": "Giá trị tối thiểu là", ">": "Giá trị phải lớn hơn" };
const numberMessage = ([, , op, amount]) => `${NUMBER_LIMIT[op]} ${amount}`;

export default {
  messages: {
    "Invalid input": "Thông tin chưa hợp lệ",
    "Invalid UUID": "Mã định danh không hợp lệ",
    "Invalid email address": "Email chưa đúng định dạng",
    "Invalid URL": "Đường dẫn chưa đúng định dạng",
    "Invalid ISO date": "Ngày chưa đúng định dạng",
    "Invalid ISO datetime": "Thời gian chưa đúng định dạng",
  },
  patterns: [
    // Thiếu field: zod v4 bỏ qua required_error nên trả "expected string, received undefined"
    [/^Invalid input: expected \w+, received (undefined|null)$/, "Còn thiếu thông tin bắt buộc"],
    [/^Invalid input: expected \w+, received \w+$/, "Thông tin nhập vào chưa đúng định dạng"],
    [/^Invalid (input: expected .+|option: expected one of .+)$/, "Lựa chọn chưa hợp lệ"],
    [/^Too (?:big|small): expected (\w+) to have (<=|<|>=|>)(\d+) \w+$/, sizeMessage],
    [/^Too (?:big|small): expected (\w+) to be (<=|<|>=|>)(-?[\d.]+)$/, numberMessage],
    [/^Invalid string: .+$/, "Thông tin chưa đúng định dạng"],
    [/^Invalid number: .+$/, "Giá trị chưa hợp lệ"],
    [/^Unrecognized keys?: .+$/, "Có thông tin không được hỗ trợ"],
  ],
};
