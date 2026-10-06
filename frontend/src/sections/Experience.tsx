import { Award, BookOpen, Briefcase, CheckCircle2, GraduationCap, Users } from "lucide-react";
import { Ph } from "../components/Ph";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { credentials } from "../data/credentials";
import type { Credential } from "../data/types";

const kindIcon = { work: Briefcase, education: GraduationCap, certification: Award, training: BookOpen, leadership: Users } as const;
const wide = (c: Credential) => c.kind === "work" || c.kind === "leadership" || !!c.badge;

export function Experience() {
  if (credentials.length === 0) return null;
  return (
    <section id="experience" aria-labelledby="exp-title" className="section pt-0 sm:pt-0">
      <div className="container-page">
        <SectionHeading id="exp-title" label="Experience" center>
          Experience, Education &amp; <span className="text-gradient">Credentials</span>
        </SectionHeading>
        <div className="grid gap-4 md:grid-cols-2">
          {credentials.map((c: Credential) => {
            const Icon = c.badge ? CheckCircle2 : kindIcon[c.kind];
            return (
              <Reveal key={c.title} className={wide(c) ? "md:col-span-2" : ""}>
                <div className="card relative h-full p-6">
                  {c.badge && <span className="pill absolute right-4 top-4 uppercase tracking-wider">{c.badge}</span>}
                  <div className="flex items-center gap-3">
                    <span className="icon-box"><Icon size={20} aria-hidden /></span>
                    {c.date && <span className="pill">{c.date}</span>}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold"><Ph>{c.title}</Ph></h3>
                  <p className="mt-1 text-sm text-accent/90"><Ph>{c.org}</Ph></p>
                  <p className="mt-3 text-sm leading-6 text-muted"><Ph>{c.description}</Ph></p>
                  {c.highlights && (
                    <ul className="mt-3 space-y-2 text-sm text-fg/90">
                      {c.highlights.map((h) => (
                        <li key={h} className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden /><span>{h}</span></li>
                      ))}
                    </ul>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
