import { ExternalLink, Github, RotateCcw } from "lucide-react";
import type { Project } from "../data/types";
import { UNAVAILABLE } from "./api";

/** Friendly failure state. Never shows raw errors. */
export function DemoUnavailable({ project, message = UNAVAILABLE, onRetry }: { project: Project; message?: string; onRetry?: () => void }) {
  return (
    <div className="card p-6 text-center" role="alert">
      <p className="font-display text-lg font-semibold">{message}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">The rest of the site works normally. You can also read the case study for the method and results.</p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {onRetry && <button type="button" onClick={onRetry} className="btn btn-ghost !min-h-[40px] !px-4"><RotateCcw size={14} aria-hidden /> Try again</button>}
        {project.demo?.url && (
          <a href={project.demo.url} target="_blank" rel="noreferrer" className="btn btn-primary !min-h-[40px] !px-4"><ExternalLink size={14} aria-hidden /> Open full demo</a>
        )}
        {project.links.github && (
          <a href={project.links.github} target="_blank" rel="noreferrer" className="btn btn-ghost !min-h-[40px] !px-4"><Github size={14} aria-hidden /> View GitHub</a>
        )}
      </div>
    </div>
  );
}
