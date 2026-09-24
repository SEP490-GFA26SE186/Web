import {
  BadgeCheck,
  Dumbbell,
  Gift,
  Handshake,
  HeartHandshake,
  Hourglass,
  Lightbulb,
  Users,
  Wind,
} from "lucide-react";

// Chủ đề EQ dùng chung cho tag, bộ lọc...
export const EQ_TOPICS = {
  emotion: { label: "Quản lý cảm xúc", icon: Wind },
  sharing: { label: "Chia sẻ & Thấu cảm", icon: HeartHandshake },
  perseverance: { label: "Lòng kiên trì", icon: Dumbbell },
  courage: { label: "Tự tin & Dũng cảm", icon: Lightbulb },
  honesty: { label: "Trung thực", icon: BadgeCheck },
  family: { label: "Yêu thương gia đình", icon: Users },
  patience: { label: "Kiên nhẫn", icon: Hourglass },
  cooperation: { label: "Hợp tác", icon: Handshake },
  gratitude: { label: "Lòng biết ơn", icon: Gift },
};
