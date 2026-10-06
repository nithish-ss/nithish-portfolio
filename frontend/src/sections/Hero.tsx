import { ArrowUpRight, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { NameMark } from "../components/NameMark";
import { Reveal } from "../components/Reveal";
import { demoProjects } from "../data/projects";
import { profile } from "../data/profile";
import { DemoButton } from "../demo/DemoButton";
import { site } from "../data/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[110px]" aria-hidden />
      <div className="container-page relative pb-16 pt-16 sm:pb-24 sm:pt-24">
        <p className="inline-flex items-center gap-2 rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 font-display text-xs font-medium uppercase tracking-[0.14em] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden /> {site.status}
        </p>
        <h1 id="hero-title" className="mt-7 text-hero font-bold"><NameMark name={site.name} /></h1>
        <p className="mt-6 max-w-2xl font-display text-xl font-medium leading-snug sm:text-3xl">{profile.headline}</p>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">{profile.tagline}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link to="/#projects" className="btn btn-primary !px-6">View projects <ArrowUpRight size={16} aria-hidden /></Link>
          <a href={site.resume} target="_blank" rel="noreferrer" className="btn btn-ghost !px-6"><Download size={16} aria-hidden /> Download resume</a>
          {demoProjects[0] && <DemoButton project={demoProjects[0]} variant="ghost" label="Live ML demo" />}
        </div>

        <Reveal className="mt-14 sm:mt-20">
          <dl className="grid max-w-3xl grid-cols-3 divide-x divide-line overflow-hidden rounded-lg border border-line bg-card/60">
            {site.stats.map((s) => (
              <div key={s.label} className="p-4 sm:p-6">
                <dt className="order-2 mt-2 text-[10px] font-medium uppercase tracking-[0.12em] text-muted sm:text-xs">{s.label}</dt>
                <dd className="font-display text-2xl font-bold text-accent sm:text-4xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
