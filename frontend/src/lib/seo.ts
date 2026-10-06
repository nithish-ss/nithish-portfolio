import { useEffect } from "react";
import { site } from "../data/site";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Sets per-route title, description, canonical and social tags. */
export const siteUrl = () => site.url || window.location.origin;

export function useSeo(title?: string, description?: string) {
  useEffect(() => {
    const full = title ? `${title} | ${site.name}` : `${site.name} | ${site.title}`;
    const desc = description ?? site.description;
    const url = siteUrl() + window.location.pathname;
    document.title = full;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", full);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", full);
    setMeta("name", "twitter:description", desc);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
  }, [title, description]);
}
