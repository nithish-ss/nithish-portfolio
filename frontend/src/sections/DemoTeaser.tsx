import { FlaskConical } from "lucide-react";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { demoProjects } from "../data/projects";
import { DemoButton } from "../demo/DemoButton";

export function DemoTeaser() {
  const project = demoProjects[0];
  if (!project) return null;
  return (
    <section id="demo" aria-labelledby="demo-title" className="section pt-0 sm:pt-0">
      <div className="container-page">
        <SectionHeading id="demo-title" label="ML demo" center sub="A working model you can adjust and query, running inside this site.">
          Try a Model <span className="text-gradient">Live</span>
        </SectionHeading>
        <Reveal>
          <div className="card mx-auto flex max-w-3xl flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex gap-4">
              <span className="icon-box"><FlaskConical size={20} aria-hidden /></span>
              <div>
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="mt-1 max-w-md text-sm leading-6 text-muted">
                  Change the delivery timing, installments and order value of an order and see how likely the customer is to leave a 4 or 5 star review. The model is trained on the public Olist dataset.
                </p>
              </div>
            </div>
            <DemoButton project={project} variant="page" label="Open the demo" className="shrink-0" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
