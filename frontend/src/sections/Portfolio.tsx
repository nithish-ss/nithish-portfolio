import { Link } from "react-router-dom";
import { ProjectCard } from "../components/ProjectCard";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { projects } from "../data/projects";

export function Portfolio() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="section pt-0 sm:pt-0">
      <div className="container-page">
        <SectionHeading id="projects-title" label="Portfolio" center sub="Each project solves a genuine business question. Open the case study for the problem, data, method, trade-offs and results.">
          Real Problems, <span className="text-gradient">Real Impact</span>
        </SectionHeading>
        {projects.length === 0 ? (
          <p className="text-center text-muted">Projects are on the way.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map((p) => <Reveal key={p.slug}><ProjectCard project={p} /></Reveal>)}
          </div>
        )}
        <p className="mt-8 text-center text-sm"><Link to="/projects" className="text-muted underline-offset-4 hover:text-accent hover:underline">See all projects</Link></p>
      </div>
    </section>
  );
}
