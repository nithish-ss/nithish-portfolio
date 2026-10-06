import { BarChart3, Brain, Database, LineChart, Sigma, Target, TrendingUp, Users, Wrench, type LucideIcon } from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  database: Database, chart: LineChart, sigma: Sigma, wrench: Wrench,
  target: Target, brain: Brain, trend: TrendingUp, users: Users, bars: BarChart3,
};
export const getIcon = (key: string): LucideIcon => iconMap[key] ?? Target;
