import { Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { demoProjects } from "../data/projects";
import { DemoButton } from "../demo/DemoButton";
import { site } from "../data/site";
import { useActiveSection } from "../hooks/useActiveSection";
import { SocialIcons } from "./Icons";
import { NameMark } from "./NameMark";

const links = [
  { id: "about", label: "About" },
  { id: "projects", label: "Portfolio" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];
const ids = links.map((l) => l.id);

export function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const active = useActiveSection(ids, isHome);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const item = (id: string) =>
    `rounded-md px-3 py-2 text-sm transition-colors ${active === id ? "text-accent" : "text-muted hover:text-fg"}`;

  return (
    <header className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-200 ${scrolled || open ? "border-line bg-bg/80 backdrop-blur-md" : "border-transparent"}`}>
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-lg font-bold tracking-tight"><NameMark name={site.name} /></Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.id} to={`/#${l.id}`} className={item(l.id)} aria-current={active === l.id ? "true" : undefined}>{l.label}</Link>
          ))}
          {demoProjects[0] && <DemoButton project={demoProjects[0]} variant="nav" label="ML Demo" icon={false} />}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex"><SocialIcons /></div>
          <a href={site.resume} target="_blank" rel="noreferrer" className="btn btn-primary !min-h-[40px] !rounded-full !px-4">
            <Download size={15} aria-hidden /> Resume
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-muted hover:text-fg md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="container-page flex flex-col gap-1 pb-5 md:hidden">
          {links.map((l) => (
            <Link key={l.id} to={`/#${l.id}`} className="flex min-h-[44px] items-center rounded-md px-2 font-display text-base text-muted hover:text-fg">{l.label}</Link>
          ))}
          {demoProjects[0] && <DemoButton project={demoProjects[0]} variant="menu" label="ML Demo" icon={false} />}
          <div className="mt-2 flex gap-2"><SocialIcons /></div>
        </nav>
      )}
    </header>
  );
}
