import { Github, Linkedin, Mail } from "lucide-react";
import { site } from "../data/site";

export const iconBtn =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card/60 text-muted transition-colors hover:border-accent/40 hover:text-accent";

export function SocialIcons() {
  return (
    <>
      <a className={iconBtn} href={site.social.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16} aria-hidden /></a>
      <a className={iconBtn} href={site.social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={16} aria-hidden /></a>
    </>
  );
}

export function EmailIcon() {
  return <a className={iconBtn} href={`mailto:${site.social.email}`} aria-label="Email"><Mail size={16} aria-hidden /></a>;
}
