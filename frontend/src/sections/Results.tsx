import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { results } from "../data/results";
import { getIcon } from "../lib/icons";

export function Results() {
  if (results.length === 0) return null;
  return (
    <section id="results" aria-labelledby="results-title" className="section pt-0 sm:pt-0">
      <div className="container-page">
        <SectionHeading id="results-title" label="Results" center sub="Numbers from the projects above, each traceable to its source.">
          Results From <span className="text-gradient">My Work</span>
        </SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2">
          {results.map((r) => {
            const Icon = getIcon(r.icon);
            return (
              <Reveal key={r.label}>
                <div className="card h-full p-6">
                  <div className="flex items-center gap-4">
                    <span className="icon-box"><Icon size={20} aria-hidden /></span>
                    <p className="font-display text-4xl font-bold text-accent">{r.value}</p>
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{r.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{r.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
