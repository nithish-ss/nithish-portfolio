import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { profile } from "../data/profile";
import { getIcon } from "../lib/icons";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <div className="container-page">
        <SectionHeading id="about-title" label="About me" sub={profile.about}>
          {profile.aboutTitle[0]}<span className="text-gradient">{profile.aboutTitle[1]}</span>
        </SectionHeading>
        <div className="grid gap-4 md:grid-cols-3">
          {profile.pillars.map((p) => {
            const Icon = getIcon(p.icon);
            return (
              <Reveal key={p.title}>
                <div className="card h-full p-6">
                  <span className="icon-box"><Icon size={20} aria-hidden /></span>
                  <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{p.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
