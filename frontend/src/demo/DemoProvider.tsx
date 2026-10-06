import { Loader2 } from "lucide-react";
import { Suspense, createContext, lazy, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { getProject } from "../data/projects";
import type { Project } from "../data/types";
import { trackDemo } from "./analytics";

// The demo UI (modal, form, iframe) is a separate chunk. It downloads only when a visitor opens a demo.
const DemoModal = lazy(() => import("./DemoModal"));

interface DemoContextValue {
  openDemo: (project: Project, trigger?: HTMLElement | null, source?: "button" | "deep_link") => void;
}
const DemoContext = createContext<DemoContextValue | null>(null);

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used inside <DemoProvider>");
  return ctx;
}

function OpeningOverlay() {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-bg/80 backdrop-blur-sm" role="status">
      <p className="flex items-center gap-2 text-sm text-muted"><Loader2 size={16} className="animate-spin" aria-hidden /> Opening demo…</p>
    </div>
  );
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Project | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [params, setParams] = useSearchParams();

  const openDemo = useCallback<DemoContextValue["openDemo"]>((project, trigger, source = "button") => {
    if (!project.demo) return;
    triggerRef.current = trigger ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setActive(project);
    trackDemo("demo_opened", { project: project.slug, type: project.demo.type, source });
  }, []);

  const closeDemo = useCallback(() => {
    setActive(null);
    // Return focus to the button that opened the demo.
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  // Deep link: /?demo=<project-slug> opens that project's demo (the old /demo URL redirects here).
  const requested = params.get("demo");
  useEffect(() => {
    if (!requested) return;
    const project = getProject(requested);
    if (project?.demo) openDemo(project, null, "deep_link");
    const next = new URLSearchParams(params);
    next.delete("demo");
    setParams(next, { replace: true });
  }, [requested, params, setParams, openDemo]);

  const value = useMemo(() => ({ openDemo }), [openDemo]);
  return (
    <DemoContext.Provider value={value}>
      {children}
      {active && (
        <Suspense fallback={<OpeningOverlay />}>
          <DemoModal project={active} onClose={closeDemo} />
        </Suspense>
      )}
    </DemoContext.Provider>
  );
}
