import type { Project } from "../data/types";
import { ProjectVisual } from "./ProjectVisual";

/** Real screenshot when `image` is set, otherwise the abstract SVG illustration. */
export function ProjectMedia({ project, className = "" }: { project: Project; className?: string }) {
  if (!project.image) return <ProjectVisual kind={project.visual} className={className} />;
  return (
    <figure className={`overflow-hidden rounded-lg border border-line ${className}`}>
      <img src={project.image} alt={`${project.title} screenshot`} width={1280} height={720} loading="lazy" decoding="async" className="block h-auto w-full" />
    </figure>
  );
}
