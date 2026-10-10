import { Brain, HeartHandshake, Scale, Users, Wind } from "lucide-react";

// 5 năng lực CASEL (enum casel_competency). Mỗi bài học (topic) gắn đúng 1 năng lực.
export const CASEL = {
  self_awareness: { label: "Tự nhận thức", short: "Tự nhận thức", icon: Brain },
  self_management: { label: "Tự quản lý", short: "Tự quản lý", icon: Wind },
  social_awareness: { label: "Nhận thức xã hội", short: "Nhận thức XH", icon: Users },
  relationship_skills: { label: "Kỹ năng quan hệ", short: "Kỹ năng QH", icon: HeartHandshake },
  responsible_decision_making: { label: "Ra quyết định có trách nhiệm", short: "Ra quyết định", icon: Scale },
};

export const CASEL_OPTIONS = Object.entries(CASEL).map(([value, { label }]) => ({ value, label }));

// story_length: Ngắn / Vừa / Dài = 6 / 8 / 10 trang; custom = truyện tự viết (4–20 trang)
export const STORY_LENGTH_LABELS = { short: "Ngắn", medium: "Vừa", long: "Dài", custom: "Tự viết" };
