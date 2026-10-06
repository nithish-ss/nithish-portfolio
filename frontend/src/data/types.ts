// Content types. Keep in sync with backend/app/schemas (see README "Keeping types in sync").

export interface Metric {
  name: string; // e.g. "F1", "RMSE"
  value: number;
  /** Where the number came from: notebook link, repo path, or eval script. Required. */
  source: string;
}

export interface CaseStudy {
  problem?: string;
  why?: string;
  data?: { source: string; size?: string; features?: string; limitations?: string; license?: string; bias?: string };
  eda?: { title: string; takeaway: string }[];
  approach?: string;
  model?: { baseline: string; alternatives: string; final: string; rationale: string };
  evaluation?: {
    task: "classification" | "regression" | "clustering" | "other";
    validation: string;
    metrics: Metric[];
    note?: string;
  };
  tradeoffs?: string[];
  deployment?: { architecture: string; api?: string; howToRun?: string };
  results?: string[];
  improve?: string[];
}

/**
 * Interactive demo configuration. A project "has a demo" when `demo` is set.
 *  - type "api":       a native form in the site's modal. The form fields, ranges and model info come
 *                      from the FastAPI model registered for this project's slug
 *                      (GET /api/projects/{slug}/demo, POST /api/projects/{slug}/predict).
 *  - type "streamlit": a Streamlit app embedded in the modal. `url` is required.
 */
export interface DemoConfig {
  type: "api" | "streamlit";
  /** "streamlit": the app to embed. "api": optional full Streamlit version for the "Open full demo" fallback. */
  url?: string;
  /** Short caption under the demo, e.g. what data it runs on. */
  note?: string;
  /** Intro text for "streamlit" demos. ("api" demos use the intro sent by the server.) */
  intro?: string;
}

export type VisualKind = "confusion" | "features" | "pipeline" | "dashboard";

export interface Project {
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string; // one-line description
  bullets: string[]; // key findings shown on the card
  tags: string[];
  featured?: boolean;
  /** Optional screenshot in /public (e.g. "/projects/superstore.png"). Falls back to an SVG illustration. */
  image?: string;
  visual: VisualKind;
  links: { github?: string; live?: string; liveLabel?: string };
  /** Set this to give the project an Interactive Demo button. Omit it and no button appears. */
  demo?: DemoConfig;
  caseStudy: CaseStudy;
}

export interface Capability {
  title: string;
  icon: "database" | "chart" | "sigma" | "wrench";
  items: { name: string; detail: string; primary?: boolean }[];
}

export interface Credential {
  kind: "work" | "education" | "certification" | "training" | "leadership";
  title: string;
  org: string;
  date: string;
  description: string;
  highlights?: string[];
  badge?: string;
}

export interface Result {
  icon: "users" | "chart" | "trend" | "target";
  value: string;
  label: string;
  description: string;
  /** Where this number comes from (notebook, dashboard, query). Required for every result. */
  source: string;
}
