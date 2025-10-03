import { Heart, Users, Zap, LucideIcon } from "lucide-react";

export interface Program {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const programs: Program[] = [
  {
    icon: Users,
    title: "Physical Wellness",
    description: "Providing access to quality gym facilities and fitness programs that promote health, strength, and physical confidence.",
  },
  {
    icon: Heart,
    title: "Community Building",
    description: "Creating supportive environments where youth can connect, build friendships, and develop positive peer relationships.",
  },
  {
    icon: Zap,
    title: "Life Skills",
    description: "Teaching discipline, goal-setting, perseverance, and self-confidence through structured fitness programs and mentorship.",
  },
];
