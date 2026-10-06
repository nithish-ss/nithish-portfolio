import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type { PredictResponse } from "./types";

/** Prediction, confidence and explanation. Everything shown comes from the server response. */
export function DemoResult({ result }: { result: PredictResponse }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const pct = result.confidence == null ? null : Math.round(result.confidence * 100);

  // On small screens the result can land below the fold: bring it into view.
  useEffect(() => { ref.current?.scrollIntoView?.({ behavior: reduce ? "auto" : "smooth", block: "nearest" }); }, [result, reduce]);

  return (
    <div ref={ref} className="card border-accent/30 p-5 sm:p-6" role="region" aria-label="Prediction result">
      <p className="eyebrow">Result</p>
      <p className="mt-3 font-display text-3xl font-bold capitalize text-gradient sm:text-4xl">{result.prediction}</p>

      {pct !== null && (
        <div className="mt-5">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-muted">Model confidence</span>
            <span className="font-display font-semibold">{pct}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Model confidence">
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-[width] duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <h3 className="mt-6 text-sm font-semibold">Why?</h3>
      <p className="mt-1 text-sm leading-6 text-muted">{result.explanation}</p>

      {result.details.length > 0 && (
        <dl className="mt-4 grid gap-2 border-t border-line pt-4 text-sm sm:grid-cols-[10rem_1fr]">
          {result.details.map((d) => (
            <div key={d.label} className="contents">
              <dt className="text-muted">{d.label}</dt>
              <dd>{d.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
