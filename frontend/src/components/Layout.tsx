import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { DemoProvider } from "../demo/DemoProvider";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { ScrollProgress } from "./ScrollProgress";

export function Layout() {
  const { pathname, hash } = useLocation();
  const reduce = useReducedMotion();
  const [showTop, setShowTop] = useState(false);

  // Scroll to the hash target (retrying while a lazy route loads), otherwise to the top.
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    let tries = 0;
    let timer: number;
    const seek = () => {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView();
      else if (tries++ < 20) timer = window.setTimeout(seek, 100);
    };
    seek();
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <DemoProvider>
      <a href="#main" className="sr-only z-50 rounded-md bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      <m.main
        id="main"
        key={pathname}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="pt-16"
      >
        <Outlet />
      </m.main>
      <Footer />
      {showTop && (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0 })}
          className="fixed bottom-5 right-5 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-bg shadow-lg shadow-accent/20 hover:brightness-110"
        >
          <ArrowUp size={18} aria-hidden />
        </button>
      )}
      </DemoProvider>
    </LazyMotion>
  );
}
