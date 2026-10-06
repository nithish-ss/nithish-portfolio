import { ProjectCard } from "../components/ProjectCard";
import { projects } from "../data/projects";
import { useSeo } from "../lib/seo";

export default function ProjectsPage() {
  useSeo("Projects", "Data science and machine learning projects with full case studies.");
  return (
    <div className="container-page py-16 sm:py-24">
      <h1 className="text-h2 font-bold">Projects</h1>
      <p className="mt-4 max-w-xl text-muted">Each one links to a case study that walks from problem to results.</p>
      {projects.length === 0 ? (
        <p className="mt-10 text-muted">No projects published yet.</p>
      ) : (
        <div className="mt-12 grid gap-5 md:grid-cols-2">{projects.map((p) => <ProjectCard key={p.slug} project={p} />)}</div>
      )}
    </div>
  );
}
