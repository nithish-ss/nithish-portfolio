import { ArrowLeft, ArrowRight, Github } from "lucide-react";
import { Suspense, lazy, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { Ph } from "../components/Ph";
import { DemoButton } from "../demo/DemoButton";
import { ProjectMedia } from "../components/ProjectMedia";
import { getProject, projects } from "../data/projects";
import { useSeo } from "../lib/seo";
import NotFound from "./NotFound";

const MetricsChart = lazy(() => import("../components/MetricsChart"));

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-line pt-8">
      <h2 id={`${id}-h`} className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 space-y-4 leading-7 text-muted">{children}</div>
    </section>
  );
}

const Dl = ({ rows }: { rows: [string, string | undefined][] }) => (
  <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-[9rem_1fr]">
    {rows.filter(([, v]) => v).map(([k, v]) => (
      <div key={k} className="contents">
        <dt className="text-sm font-medium text-fg">{k}</dt>
        <dd className="text-sm"><Ph>{v as string}</Ph></dd>
      </div>
    ))}
  </dl>
);

const List = ({ items }: { items: string[] }) => (
  <ul className="list-disc space-y-2 pl-5">{items.map((t) => <li key={t}><Ph>{t}</Ph></li>)}</ul>
);

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const p = getProject(slug);
  useSeo(p?.title, p?.summary);
  if (!p) return <NotFound what="project" />;

  const c = p.caseStudy;
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const prev = projects[idx - 1];
  const next = projects[idx + 1];
  const ev = c.evaluation;

  const toc = [
    c.problem && ["problem", "Problem"], c.why && ["why", "Why it matters"], c.data && ["data", "Data"],
    c.eda?.length && ["eda", "Exploratory analysis"], (c.approach || c.model) && ["approach", "Approach and model"],
    ev && ["evaluation", "Evaluation"], c.tradeoffs?.length && ["tradeoffs", "Trade-offs"],
    c.deployment && ["deployment", "Deployment"], c.results?.length && ["results", "Results"],
    c.improve?.length && ["improve", "What I'd improve"],
  ].filter(Boolean) as [string, string][];

  return (
    <div className="container-page py-16 sm:py-24">
      <Link to="/projects" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-muted hover:text-fg"><ArrowLeft size={14} aria-hidden /> All projects</Link>
      <header className="mt-4 max-w-3xl">
        <p className="meta">{p.category} · <Ph>{p.year}</Ph></p>
        <h1 className="mt-2 text-h2 font-bold"><Ph>{p.title}</Ph></h1>
        <p className="mt-4 text-lg text-muted"><Ph>{p.summary}</Ph></p>
        <ul className="mt-5 flex flex-wrap gap-1.5">{p.tags.map((t) => <li key={t} className="tag">{t}</li>)}</ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <DemoButton project={p} variant="page" label="Try interactive demo" />
          {p.links.github && <a className="btn btn-ghost" href={p.links.github} target="_blank" rel="noreferrer"><Github size={16} aria-hidden /> GitHub</a>}
          {p.links.live && <a className="btn btn-ghost" href={p.links.live} target="_blank" rel="noreferrer">{p.links.liveLabel ?? "Live demo"}</a>}
        </div>
      </header>

      <ProjectMedia project={p} className="mt-10 max-w-3xl" />

      <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_14rem]">
        <div className="max-w-3xl space-y-10">
          {c.problem && <Block id="problem" title="Problem"><p><Ph>{c.problem}</Ph></p></Block>}
          {c.why && <Block id="why" title="Why it matters"><p><Ph>{c.why}</Ph></p></Block>}
          {c.data && (
            <Block id="data" title="Data">
              <Dl rows={[["Source", c.data.source], ["Size", c.data.size], ["Features", c.data.features], ["Limitations", c.data.limitations], ["License", c.data.license], ["Known bias", c.data.bias]]} />
            </Block>
          )}
          {c.eda && c.eda.length > 0 && (
            <Block id="eda" title="Exploratory analysis">
              {c.eda.map((e) => (
                <div key={e.title} className="card p-4">
                  <p className="font-medium text-fg"><Ph>{e.title}</Ph></p>
                  <p className="mt-1 text-sm"><Ph>{e.takeaway}</Ph></p>
                </div>
              ))}
            </Block>
          )}
          {(c.approach || c.model) && (
            <Block id="approach" title="Approach and model">
              {c.approach && <p><Ph>{c.approach}</Ph></p>}
              {c.model && <Dl rows={[["Baseline", c.model.baseline], ["Alternatives", c.model.alternatives], ["Final model", c.model.final], ["Why this one", c.model.rationale]]} />}
            </Block>
          )}
          {ev && (
            <Block id="evaluation" title="Evaluation">
              <p className="text-sm"><span className="font-medium text-fg">Validation:</span> <Ph>{ev.validation}</Ph></p>
              {ev.metrics.length > 0 ? (
                <>
                  <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-fg/5" aria-label="Loading chart" />}>
                    <MetricsChart metrics={ev.metrics} />
                  </Suspense>
                  <ul className="space-y-1 text-sm">
                    {ev.metrics.map((m) => <li key={m.name}><span className="font-medium text-fg">{m.name}: {m.value}</span> <span className="meta">source: {m.source}</span></li>)}
                  </ul>
                </>
              ) : (
                <p className="card p-4 text-sm">Results pending. Metrics appear here once they are measured and linked to a source.</p>
              )}
              {ev.note && <p className="text-sm">{ev.note}</p>}
            </Block>
          )}
          {c.tradeoffs && c.tradeoffs.length > 0 && <Block id="tradeoffs" title="Trade-offs"><List items={c.tradeoffs} /></Block>}
          {c.deployment && (
            <Block id="deployment" title="Deployment">
              <Dl rows={[["Architecture", c.deployment.architecture], ["API", c.deployment.api], ["How to run", c.deployment.howToRun]]} />
            </Block>
          )}
          {c.results && c.results.length > 0 && <Block id="results" title="Results"><List items={c.results} /></Block>}
          {c.improve && c.improve.length > 0 && <Block id="improve" title="What I'd improve"><List items={c.improve} /></Block>}
        </div>

        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-24">
            <p className="mb-3 text-sm font-medium">On this page</p>
            <ul className="space-y-2 border-l border-line pl-4 text-sm text-muted">
              {toc.map(([id, label]) => <li key={id}><a className="hover:text-fg" href={`#${id}`}>{label}</a></li>)}
            </ul>
          </nav>
        </aside>
      </div>

      <nav aria-label="More projects" className="mt-20 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
        {prev ? <Link to={`/projects/${prev.slug}`} className="card flex items-center gap-3 p-4 hover:border-accent"><ArrowLeft size={16} aria-hidden /><span><span className="meta block">Previous</span><Ph>{prev.title}</Ph></span></Link> : <span />}
        {next && <Link to={`/projects/${next.slug}`} className="card flex items-center justify-end gap-3 p-4 text-right hover:border-accent"><span><span className="meta block">Next</span><Ph>{next.title}</Ph></span><ArrowRight size={16} aria-hidden /></Link>}
      </nav>
    </div>
  );
}
