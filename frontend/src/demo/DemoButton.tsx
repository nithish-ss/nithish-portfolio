import { PlayCircle } from "lucide-react";
import type { Project } from "../data/types";
import { useDemo } from "./DemoProvider";

const styles = {
  card: "btn btn-primary !min-h-[40px] !px-4",
  page: "btn btn-primary",
  ghost: "btn btn-ghost !px-6 !text-accent",
  nav: "rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-fg",
  menu: "flex min-h-[44px] w-full items-center rounded-md px-2 font-display text-base text-muted hover:text-fg",
} as const;

interface Props { project: Project; variant?: keyof typeof styles; label?: string; icon?: boolean; className?: string }

/** The one Interactive Demo button. Renders nothing for projects without a `demo` config. */
export function DemoButton({ project, variant = "card", label = "Interactive demo", icon = true, className = "" }: Props) {
  const { openDemo } = useDemo();
  if (!project.demo) return null;
  return (
    <button
      type="button"
      className={`${styles[variant]} ${className}`}
      aria-haspopup="dialog"
      aria-label={`${label}: ${project.title}`}
      onClick={(e) => openDemo(project, e.currentTarget)}
    >
      {icon && <PlayCircle size={variant === "card" ? 15 : 16} aria-hidden />} {label}
    </button>
  );
}
