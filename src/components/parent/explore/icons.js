import {
  Award,
  BookOpen,
  Brain,
  CircleCheckBig,
  Gift,
  Handshake,
  Heart,
  Hourglass,
  ListChecks,
  Moon,
  Smile,
  Sparkles,
  Users,
} from "lucide-react";

// Map key icon từ API/mock sang component lucide
export const EQ_ICONS = {
  heart: Heart,
  checklist: ListChecks,
  hourglass: Hourglass,
  smile: Smile,
  handshake: Handshake,
  users: Users,
  gift: Gift,
  sparkles: Sparkles,
  moon: Moon,
};

export const STAT_ICONS = {
  book: BookOpen,
  brain: Brain,
  check: CircleCheckBig,
  award: Award,
};

export const formatReaders = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : `${n}`);
