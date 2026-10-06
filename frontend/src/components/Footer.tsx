import { site } from "../data/site";
import { NameMark } from "./NameMark";

export function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="container-page flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-base font-bold"><NameMark name={site.name} /></p>
          <p className="mt-1 text-sm text-muted">{site.title} · {site.location}</p>
          <p className="meta mt-4">Built with React, FastAPI and Python</p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <ul className="flex gap-5 text-sm text-muted">
            <li><a className="hover:text-accent" href={site.social.github} target="_blank" rel="noreferrer">GitHub</a></li>
            <li><a className="hover:text-accent" href={site.social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a className="hover:text-accent" href={`mailto:${site.social.email}`}>Email</a></li>
          </ul>
          <p className="meta">© {new Date().getFullYear()} {site.name}</p>
        </div>
      </div>
    </footer>
  );
}
