import { m, useReducedMotion } from "framer-motion";
import { ArrowRight, ExternalLink, Github, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { DemoEmbed } from "../components/DemoEmbed";
import type { Project } from "../data/types";
import ApiDemo from "./ApiDemo";

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])';

interface Props { project: Project; onClose: () => void }

/** Accessible dialog: Escape closes, Tab is trapped inside, focus returns to the opener (see DemoProvider). */
export default function DemoModal({ project, onClose }: Props) {
  const demo = project.demo;
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const { pathname } = useLocation();
  const onCasePage = pathname === `/projects/${project.slug}`;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key !== "Tab" || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) { e.preventDefault(); panel.current.focus(); return; }
      const first = items[0], last = items[items.length - 1];
      const active = document.activeElement;
      if (!panel.current.contains(active) || (e.shiftKey && (active === first || active === panel.current))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!demo) return null;
  const link = "btn btn-ghost !min-h-[40px] !px-4";

  return (
    <div
      className="fixed inset-0 z-[60] flex bg-bg/80 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <m.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex h-full w-full flex-col overflow-hidden border-line bg-bg shadow-2xl shadow-black/40 outline-none sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-2xl sm:border"
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="eyebrow">Interactive ML demo</p>
            <h2 id={titleId} className="mt-1 text-xl font-bold leading-snug sm:text-2xl">{project.title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close demo" className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-fg/5 hover:text-fg">
            <X size={20} aria-hidden />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {demo.type === "api" ? (
            <ApiDemo project={project} />
          ) : (
            <div className="space-y-4">
              {demo.intro && <p className="text-sm leading-6 text-muted">{demo.intro}</p>}
              {demo.url && <DemoEmbed url={demo.url} title={`${project.title} demo`} note={demo.note} heightClass="h-[62vh] min-h-[420px]" showOpenButton={false} />}
            </div>
          )}
        </div>

        <footer className="flex flex-wrap gap-2 border-t border-line px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
          {onCasePage ? null : (
            <Link to={`/projects/${project.slug}`} onClick={onClose} className="btn !min-h-[40px] border border-accent/30 bg-accent/10 !px-4 text-accent hover:bg-accent/20">
              View case study <ArrowRight size={14} aria-hidden />
            </Link>
          )}
          {project.links.github && <a href={project.links.github} target="_blank" rel="noreferrer" className={link}><Github size={14} aria-hidden /> GitHub</a>}
          {demo.url && <a href={demo.url} target="_blank" rel="noreferrer" className={link}><ExternalLink size={14} aria-hidden /> Open full demo</a>}
        </footer>
      </m.div>
    </div>
  );
}
