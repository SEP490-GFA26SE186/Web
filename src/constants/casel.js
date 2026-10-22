import { BookOpen, Brain, HeartHandshake, Scale, Users, Wind } from "lucide-react";

// 5 năng lực CASEL (enum casel_competency). Mỗi bài học (topic) gắn đúng 1 năng lực.
export const CASEL = {
  self_awareness: { label: "Tự nhận thức", short: "Tự nhận thức", icon: Brain },
  self_management: { label: "Tự quản lý", short: "Tự quản lý", icon: Wind },
  social_awareness: { label: "Nhận thức xã hội", short: "Nhận thức XH", icon: Users },
  relationship_skills: { label: "Kỹ năng quan hệ", short: "Kỹ năng QH", icon: HeartHandshake },
  responsible_decision_making: { label: "Ra quyết định có trách nhiệm", short: "Ra quyết định", icon: Scale },
};

// Trang khung CASEL — đường dẫn tham khảo mặc định của mẫu câu hỏi (khớp CASEL_URL của BE)
export const CASEL_URL = "https://casel.org/fundamentals-of-sel/what-is-the-casel-framework/";

// Bìa dự phòng khi truyện chưa có tranh: nền + biểu tượng theo năng lực CASEL của truyện.
// Chuỗi class viết đủ (không ghép) để Tailwind quét được.
export const CASEL_COVER = {
  self_awareness: { gradient: "from-amber-200 via-orange-100 to-rose-100", tone: "text-amber-700", icon: Brain },
  self_management: { gradient: "from-sky-200 via-cyan-100 to-teal-100", tone: "text-sky-700", icon: Wind },
  social_awareness: { gradient: "from-violet-200 via-purple-100 to-indigo-100", tone: "text-violet-700", icon: Users },
  relationship_skills: { gradient: "from-rose-200 via-pink-100 to-orange-100", tone: "text-rose-700", icon: HeartHandshake },
  responsible_decision_making: { gradient: "from-emerald-200 via-teal-100 to-lime-100", tone: "text-emerald-700", icon: Scale },
};
// Truyện không gắn năng lực (truyện tự viết không chọn bài học)
export const NEUTRAL_COVER = { gradient: "from-primary-tint via-surface to-secondary-tint", tone: "text-primary-dark", icon: BookOpen };

export const CASEL_OPTIONS = Object.entries(CASEL).map(([value, { label }]) => ({ value, label }));

// story_length: Ngắn / Vừa / Dài = 6 / 8 / 10 trang; custom = truyện tự viết (4–20 trang)
export const STORY_LENGTH_LABELS = { short: "Ngắn", medium: "Vừa", long: "Dài", custom: "Tự viết" };
