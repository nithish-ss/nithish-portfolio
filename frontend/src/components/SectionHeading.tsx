import type { ReactNode } from "react";

interface Props { id: string; label: string; children: ReactNode; sub?: string; center?: boolean }

/** Label + large heading. Wrap the highlighted words in <span className="text-gradient">. */
export function SectionHeading({ id, label, children, sub, center }: Props) {
  return (
    <div className={`mb-12 ${center ? "mx-auto text-center" : ""} max-w-2xl`}>
      <p className="eyebrow">{label}</p>
      <h2 id={id} className="mt-3 text-h2 font-bold">{children}</h2>
      {sub && <p className="mt-4 text-muted">{sub}</p>}
    </div>
  );
}
