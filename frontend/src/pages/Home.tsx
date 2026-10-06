import { useEffect } from "react";
import { profile } from "../data/profile";
import { site } from "../data/site";
import { siteUrl, useSeo } from "../lib/seo";
import { About } from "../sections/About";
import { Capabilities } from "../sections/Capabilities";
import { Contact } from "../sections/Contact";
import { Experience } from "../sections/Experience";
import { Hero } from "../sections/Hero";
import { DemoTeaser } from "../sections/DemoTeaser";
import { Portfolio } from "../sections/Portfolio";
import { Results } from "../sections/Results";

export default function Home() {
  useSeo();
  // JSON-LD Person schema for search engines
  useEffect(() => {
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.text = JSON.stringify({
      "@context": "https://schema.org", "@type": "Person", name: site.name, url: siteUrl(),
      jobTitle: profile.headline, sameAs: [site.social.github, site.social.linkedin],
    });
    document.head.appendChild(el);
    return () => { el.remove(); };
  }, []);
  return (
    <>
      <Hero />
      <About />
      <Capabilities />
      <Portfolio />
      <DemoTeaser />
      <Results />
      <Experience />
      <Contact />
    </>
  );
}
