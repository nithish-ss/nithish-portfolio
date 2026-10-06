import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

/** Adds Streamlit's embed flag so the app renders without its own page chrome. */
export const embedUrl = (url: string) => url + (url.includes("?") ? "&" : "?") + "embed=true";

type State = "checking" | "up" | "down";

/** For same-site demos (/streamlit/), confirm Streamlit is really answering before framing it. */
function useDemoState(url: string): State {
  const sameSite = url.startsWith("/");
  const [state, setState] = useState<State>(sameSite ? "checking" : "up");
  useEffect(() => {
    if (!sameSite) return;
    const ctl = new AbortController();
    const timer = window.setTimeout(() => ctl.abort(), 5000);
    fetch(`${url.replace(/\/$/, "")}/_stcore/health`, { signal: ctl.signal })
      .then((r) => (r.ok ? r.text() : ""))
      .then((body) => setState(body.trim() === "ok" ? "up" : "down"))
      .catch(() => setState("down"))
      .finally(() => window.clearTimeout(timer));
    return () => { ctl.abort(); window.clearTimeout(timer); };
  }, [url, sameSite]);
  return state;
}

interface Props { url: string; title: string; note?: string; heightClass?: string; showOpenButton?: boolean }

/** Streamlit shown inside the page, with a button to open it full screen. */
export function DemoEmbed({ url, title, note, heightClass = "h-[760px]", showOpenButton = true }: Props) {
  const state = useDemoState(url);
  const [loaded, setLoaded] = useState(false);
  const open = (
    <a href={url} target="_blank" rel="noreferrer" className="btn btn-primary !min-h-[40px] !px-4">
      <ExternalLink size={14} aria-hidden /> Open full demo
    </a>
  );

  if (state === "down") {
    return (
      <div className="card p-6 text-sm text-muted" role="status">
        <p className="font-medium text-fg">Interactive demo is temporarily unavailable.</p>
        <p className="mt-2">Please check back later, or use the buttons below to open the full demo or read the case study.</p>
        {import.meta.env.DEV && (
          <p className="mt-3 rounded-md border border-line p-3 font-mono text-xs">
            Dev hint: start the demo with <code>start.bat</code> (or <code>cd ml</code>, <code>python train_olist.py</code>, then{" "}
            <code>streamlit run app.py --server.baseUrlPath=streamlit</code>).
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      {showOpenButton && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">Interactive Streamlit app, running inside this page.</p>
          {open}
        </div>
      )}
      <div className="relative overflow-hidden rounded-lg border border-line bg-card/60">
        {(state === "checking" || !loaded) && (
          <div className="absolute inset-0 grid place-items-center text-sm text-muted" aria-live="polite">Loading demo…</div>
        )}
        {state === "up" && (
          <iframe
            src={embedUrl(url)}
            title={title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            allow="clipboard-write"
            className={`block w-full max-w-full ${heightClass}`}
          />
        )}
        {state === "checking" && <div className={heightClass} />}
      </div>
      {note && <p className="mt-3 text-sm text-muted">{note}</p>}
    </div>
  );
}
