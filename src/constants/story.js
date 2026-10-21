// Nhãn tiếng Việt cho enum của truyện (schema rev8, ai/docs/02-glossary.md).

export const STORY_STATUS_LABELS = {
  draft: "Bản nháp",
  generating: "AI đang viết",
  ready: "Đã viết xong",
};

// Kiểu điểm dừng (checkpoint_type)
export const CHECKPOINT_TYPES = {
  emotion_self: { label: "Nhận diện cảm xúc của nhân vật chính", short: "Cảm xúc (nhân vật chính)" },
  emotion_other: { label: "Nhận diện cảm xúc của nhân vật khác", short: "Cảm xúc (nhân vật khác)" },
  perspective: { label: "Đặt mình vào vị trí người khác", short: "Thấu hiểu" },
  problem_solving: { label: "Giải quyết tình huống", short: "Giải quyết tình huống" },
  reflection: { label: "Liên hệ bản thân (không chấm điểm)", short: "Liên hệ bản thân" },
};

export const NEEDS_TARGET = ["emotion_other", "perspective"];

// Bộ 5 cảm xúc cố định (emotion)
export const EMOTIONS = {
  happy: "Vui",
  sad: "Buồn",
  angry: "Giận",
  scared: "Sợ",
  neutral: "Bình thường",
};

// Dạng trả lời của mẫu câu hỏi (question_templates.answer_format)
export const ANSWER_FORMATS = {
  emotion_pick: "Chọn cảm xúc",
  single_correct: "Chọn 1 đáp án đúng",
  role_choice: "Chọn cách xử lý (3 vai)",
};

// Vai của phương án giải quyết tình huống (option_role) — do khung quy định, không đổi
export const OPTION_ROLES = {
  constructive: { label: "Xây dựng", tone: "bg-secondary-tint text-secondary-dark" },
  avoidant: { label: "Né tránh", tone: "bg-navy-tint text-navy" },
  impulsive: { label: "Bốc đồng", tone: "bg-primary-tint text-primary-dark" },
};

// Độ dài truyện AI viết (story_layout trong platform_settings); "custom" = tự viết
export const AI_LENGTHS = [
  { value: "short", label: "Ngắn", pages: 6 },
  { value: "medium", label: "Vừa", pages: 8 },
  { value: "long", label: "Dài", pages: 10 },
];
