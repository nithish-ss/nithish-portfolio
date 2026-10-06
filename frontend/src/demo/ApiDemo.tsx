import { Loader2, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import type { Project } from "../data/types";
import { DemoApiError, getDemoSchema, runPrediction } from "./api";
import { trackDemo } from "./analytics";
import { DemoResult } from "./DemoResult";
import { DemoUnavailable } from "./DemoUnavailable";
import type { DemoField, DemoSchema, FieldValue, PredictResponse } from "./types";

type Load = { s: "loading" } | { s: "error" } | { s: "ready"; schema: DemoSchema };
type Run = { s: "idle" } | { s: "loading" } | { s: "result"; result: PredictResponse } | { s: "error"; kind: DemoApiError["kind"]; message: string };

const METRIC_NAMES: Record<string, string> = {
  accuracy: "Accuracy", balanced_accuracy: "Balanced accuracy", precision: "Precision", recall: "Recall", f1: "F1", roc_auc: "ROC-AUC",
  baseline_accuracy: "Always-satisfied baseline accuracy",
};

function initialValues(fields: DemoField[]): Record<string, FieldValue> {
  const out: Record<string, FieldValue> = {};
  for (const f of fields) {
    if (f.kind === "number") out[f.key] = typeof f.default === "number" ? f.default : f.min ?? 0;
    else if (f.kind === "select") out[f.key] = typeof f.default === "string" ? f.default : f.options?.[0]?.value ?? "";
    else out[f.key] = Array.isArray(f.default) ? f.default : [];
  }
  return out;
}

/** Native demo: builds its form from the model's schema, sends inputs to FastAPI, shows the prediction. */
export default function ApiDemo({ project }: { project: Project }) {
  const slug = project.slug;
  const [load, setLoad] = useState<Load>({ s: "loading" });
  const [values, setValues] = useState<Record<string, FieldValue>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [run, setRun] = useState<Run>({ s: "idle" });
  const ctl = useRef<AbortController | null>(null);

  const loadSchema = useCallback(() => {
    ctl.current?.abort();
    const c = new AbortController();
    ctl.current = c;
    setLoad({ s: "loading" });
    getDemoSchema(slug, c.signal)
      .then((schema) => { setValues(initialValues(schema.fields)); setLoad({ s: "ready", schema }); })
      .catch((e) => {
        if (c.signal.aborted) return;
        trackDemo("demo_error", { project: slug, type: "api", error: e instanceof DemoApiError ? e.kind : "unknown" });
        setLoad({ s: "error" });
      });
  }, [slug]);

  useEffect(() => { loadSchema(); return () => ctl.current?.abort(); }, [loadSchema]);

  const set = (key: string, v: FieldValue) => { setValues((p) => ({ ...p, [key]: v })); setErrors((p) => ({ ...p, [key]: "" })); };

  function validate(fields: DemoField[]): Record<string, string> {
    const out: Record<string, string> = {};
    for (const f of fields) {
      const v = values[f.key];
      if (f.kind === "number") {
        if (typeof v !== "number" || !Number.isFinite(v)) out[f.key] = "Enter a number.";
        else if ((f.min != null && v < f.min) || (f.max != null && v > f.max)) out[f.key] = `Enter a value between ${f.min} and ${f.max}.`;
      } else if (f.kind === "select" && !v) out[f.key] = "Choose an option.";
    }
    return out;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (load.s !== "ready" || run.s === "loading") return;
    const found = validate(load.schema.fields);
    setErrors(found);
    if (Object.keys(found).length) return;

    ctl.current?.abort();
    const c = new AbortController();
    ctl.current = c;
    setRun({ s: "loading" });
    const t0 = performance.now();
    trackDemo("demo_prediction_started", { project: slug, type: "api" });
    try {
      const result = await runPrediction(slug, values, c.signal);
      setRun({ s: "result", result });
      trackDemo("demo_prediction_completed", { project: slug, type: "api", durationMs: Math.round(performance.now() - t0) });
    } catch (err) {
      if (c.signal.aborted) return;
      const known = err instanceof DemoApiError ? err : new DemoApiError("unavailable", "Interactive demo is temporarily unavailable.");
      setRun({ s: "error", kind: known.kind, message: known.message });
      trackDemo("demo_error", { project: slug, type: "api", error: known.kind });
    }
  }

  if (load.s === "loading") {
    return (
      <div className="space-y-4" role="status" aria-label="Loading demo">
        <div className="h-5 w-2/3 animate-pulse rounded bg-fg/10" />
        {[0, 1, 2].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-fg/5" />)}
      </div>
    );
  }
  if (load.s === "error") return <DemoUnavailable project={project} onRetry={loadSchema} />;

  const { schema } = load;
  const field = "mt-2 w-full rounded-md border border-line bg-bg/60 px-3 py-2.5 text-sm focus:border-accent";

  return (
    <div className="space-y-6">
      <p className="text-sm leading-6 text-muted">{schema.intro}</p>

      <form onSubmit={onSubmit} noValidate className="space-y-5" aria-label={`${project.title} inputs`}>
        {schema.fields.map((f) => {
          const id = `demo-${slug}-${f.key.replace(/\W+/g, "-")}`;
          const err = errors[f.key];
          const help = f.help ? `${id}-help` : undefined;
          const describedBy = [help, err ? `${id}-err` : undefined].filter(Boolean).join(" ") || undefined;
          const v = values[f.key];
          return (
            <div key={f.key}>
              {f.kind === "number" && (
                <>
                  <div className="flex items-baseline justify-between gap-3">
                    <label htmlFor={id} className="text-sm font-medium">{f.label}{f.unit ? <span className="text-muted"> ({f.unit})</span> : null}</label>
                    <input
                      aria-label={`${f.label} value`}
                      type="number" inputMode="decimal" min={f.min ?? undefined} max={f.max ?? undefined} step={f.step ?? "any"}
                      value={typeof v === "number" && Number.isFinite(v) ? v : ""}
                      onChange={(e) => set(f.key, e.target.value === "" ? NaN : Number(e.target.value))}
                      className="w-28 rounded-md border border-line bg-bg/60 px-2 py-1.5 text-right font-mono text-sm focus:border-accent"
                      aria-invalid={!!err}
                    />
                  </div>
                  <input
                    id={id} type="range" min={f.min ?? 0} max={f.max ?? 100} step={f.step ?? "any"}
                    value={typeof v === "number" && Number.isFinite(v) ? v : f.min ?? 0}
                    onChange={(e) => set(f.key, Number(e.target.value))}
                    aria-describedby={describedBy}
                    className="mt-2 h-6 w-full cursor-pointer accent-accent"
                  />
                  <div className="meta flex justify-between"><span>{f.min}</span><span>{f.max}</span></div>
                </>
              )}
              {f.kind === "select" && (
                <>
                  <label htmlFor={id} className="text-sm font-medium">{f.label}</label>
                  <select id={id} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} className={field} aria-invalid={!!err} aria-describedby={describedBy}>
                    {(f.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </>
              )}
              {f.kind === "multiselect" && (
                <fieldset aria-describedby={describedBy}>
                  <legend className="text-sm font-medium">{f.label}</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(f.options ?? []).map((o) => {
                      const list = Array.isArray(v) ? v : [];
                      const on = list.includes(o.value);
                      return (
                        <label key={o.value} className={`inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-md border px-3 text-sm ${on ? "border-accent/50 bg-accent/10 text-accent" : "border-line text-muted hover:text-fg"}`}>
                          <input type="checkbox" className="accent-accent" checked={on} onChange={() => set(f.key, on ? list.filter((x) => x !== o.value) : [...list, o.value])} />
                          {o.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}
              {f.help && <p id={help} className="mt-1 text-xs text-muted">{f.help}</p>}
              {err && <p id={`${id}-err`} className="mt-1 text-sm text-red-400">{err}</p>}
            </div>
          );
        })}

        <button type="submit" disabled={run.s === "loading"} className="btn btn-primary w-full !rounded-full disabled:opacity-60 sm:w-auto sm:min-w-[12rem]">
          {run.s === "loading" ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Play size={15} aria-hidden />}
          {run.s === "loading" ? "Analyzing…" : schema.submit_label}
        </button>
      </form>

      <div aria-live="polite" className="space-y-4">
        {run.s === "loading" && (
          <div className="card p-5" role="status">
            <p className="flex items-center gap-2 text-sm text-muted"><Loader2 size={15} className="animate-spin text-accent" aria-hidden /> Analyzing your inputs…</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full w-1/3 animate-pulse rounded-full bg-accent/60" /></div>
          </div>
        )}
        {run.s === "result" && <DemoResult result={run.result} />}
        {run.s === "error" && (run.kind === "unavailable"
          ? <DemoUnavailable project={project} onRetry={() => setRun({ s: "idle" })} />
          : <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300" role="alert">{run.message}</p>)}
      </div>

      <details className="card group p-4 text-sm">
        <summary className="cursor-pointer font-medium marker:text-accent">Model information</summary>
        <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-[8rem_1fr]">
          <dt className="text-muted">Model</dt><dd className="capitalize">{schema.model.name}</dd>
          <dt className="text-muted">Data</dt><dd>{schema.model.dataset}</dd>
          {schema.model.validation && <><dt className="text-muted">Validation</dt><dd>{schema.model.validation}</dd></>}
          {Object.keys(schema.model.metrics).length > 0 && (
            <>
              <dt className="text-muted">Held-out metrics</dt>
              <dd className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
                {Object.entries(schema.model.metrics).map(([k, val]) => <span key={k}>{METRIC_NAMES[k] ?? k}: {val.toFixed(3)}</span>)}
              </dd>
            </>
          )}
        </dl>
        <p className="mt-3 text-xs text-muted">Metrics are read from the training run's output, not typed in by hand.</p>
      </details>

      {(schema.model.notes.length > 0 || project.demo?.note) && (
        <ul className="space-y-1 text-xs text-muted">
          {project.demo?.note && <li>{project.demo.note}</li>}
          {schema.model.notes.map((n) => <li key={n}>{n}</li>)}
        </ul>
      )}
    </div>
  );
}
