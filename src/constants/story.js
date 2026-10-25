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

// Dạng trả lời gợi ý theo năng lực CASEL (chỉ gợi ý — Specialist vẫn chọn được dạng khác).
// Câu có chấm phải đo đúng kỹ năng con: nhận diện cảm xúc / hiểu nguyên nhân hợp với hai năng lực "nhận thức",
// còn các năng lực về hành động đo bằng việc bé chọn cách xử lý.
export const SUGGESTED_FORMATS = {
  self_awareness: { formats: ["emotion_pick", "single_correct"], why: "bé nhận ra và gọi tên cảm xúc, suy nghĩ của chính mình" },
  social_awareness: { formats: ["emotion_pick", "single_correct"], why: "bé nhận ra cảm xúc và hiểu vì sao người khác cảm thấy như vậy" },
  self_management: { formats: ["role_choice"], why: "bé chọn cách tự điều chỉnh hành động khi gặp tình huống" },
  relationship_skills: { formats: ["role_choice", "single_correct"], why: "bé chọn cách cư xử với người khác (nhờ giúp, chia sẻ, làm lành…)" },
  responsible_decision_making: { formats: ["role_choice", "single_correct"], why: "bé cân nhắc và chọn việc nên làm" },
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
