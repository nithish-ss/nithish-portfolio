import { ArrowRight, Github, BarChart3, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../data/types";
import { DemoButton } from "../demo/DemoButton";
import { Ph } from "./Ph";
import { ProjectMedia } from "./ProjectMedia";

export function ProjectCard({ project: p }: { project: Project }) {
  const quiet = "inline-flex min-h-[44px] items-center gap-1.5 text-sm text-muted hover:text-fg";
  return (
    <article className="card flex h-full flex-col p-4 transition-colors duration-200 hover:border-accent/30 sm:p-5">
      <div className="relative">
        <ProjectMedia project={p} />
        {p.featured && <span className="pill absolute left-3 top-3 bg-bg/90">Featured project</span>}
        {p.demo && <span className="pill absolute right-3 top-3 bg-bg/90"><span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" aria-hidden />Interactive</span>}
      </div>
      <div className="mt-5 flex items-start gap-3">
        <span className="icon-box"><BarChart3 size={18} aria-hidden /></span>
        <div>
          <h3 className="text-lg font-semibold leading-snug"><Link to={`/projects/${p.slug}`} className="hover:text-accent"><Ph>{p.title}</Ph></Link></h3>
          <p className="mt-1 text-sm leading-6 text-muted"><Ph>{p.summary}</Ph></p>
        </div>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-fg/90">
        {p.bullets.map((b) => (
          <li key={b} className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden /><span><Ph>{b}</Ph></span></li>
        ))}
      </ul>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">{p.tags.map((t) => <li key={t} className="tag">{t}</li>)}</ul>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-5">
        <DemoButton project={p} variant="card" className="mr-1" />
        <Link to={`/projects/${p.slug}`} className="btn !min-h-[40px] border border-accent/30 bg-accent/10 !px-4 text-accent hover:bg-accent/20">
          View case study <ArrowRight size={14} aria-hidden />
        </Link>
        {p.links.github && <a href={p.links.github} target="_blank" rel="noreferrer" className={quiet}><Github size={14} aria-hidden /> GitHub</a>}
        {p.links.live && <a href={p.links.live} target="_blank" rel="noreferrer" className={`${quiet} !text-accent`}><ExternalLink size={14} aria-hidden /> {p.links.liveLabel ?? "Live demo"}</a>}
      </div>
    </article>
  );
}
