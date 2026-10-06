import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { capabilities } from "../data/capabilities";
import { getIcon } from "../lib/icons";

export function Capabilities() {
  return (
    <section id="capabilities" aria-labelledby="cap-title" className="section pt-0 sm:pt-0">
      <div className="container-page">
        <SectionHeading id="cap-title" label="Capabilities">
          Analytical <span className="text-gradient">Capabilities</span>
        </SectionHeading>
        <div className="grid gap-4 md:grid-cols-2">
          {capabilities.map((c) => {
            const Icon = getIcon(c.icon);
            return (
              <Reveal key={c.title}>
                <div className="card h-full p-6">
                  <div className="flex items-center gap-3">
                    <span className="icon-box !h-9 !w-9"><Icon size={18} aria-hidden /></span>
                    <h3 className="text-lg font-semibold">{c.title}</h3>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {c.items.map((i) => (
                      <li key={c.title + i.name} className="grid grid-cols-[5.25rem_1fr] items-start gap-3 text-sm sm:grid-cols-[6rem_1fr]">
                        <span className={i.primary ? "pill text-center" : "rounded border border-line px-2 py-0.5 text-center font-display text-xs font-medium text-muted"}>{i.name}</span>
                        <span className="pt-0.5 text-muted">{i.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
