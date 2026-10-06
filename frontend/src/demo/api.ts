import type { DemoSchema, FieldValue, PredictResponse } from "./types";

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
export const UNAVAILABLE = "Interactive demo is temporarily unavailable.";

export type DemoErrorKind = "unavailable" | "invalid" | "rate_limited";

/** Errors carry a message that is safe to show to visitors. */
export class DemoApiError extends Error {
  constructor(public kind: DemoErrorKind, message: string) { super(message); }
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, init);
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new DemoApiError("unavailable", UNAVAILABLE); // network down, server stopped...
  }
  if (res.ok) {
    try { return (await res.json()) as T; } catch { throw new DemoApiError("unavailable", UNAVAILABLE); }
  }
  const body = (await res.json().catch(() => ({}))) as { detail?: unknown };
  const detail = typeof body.detail === "string" ? body.detail : undefined;
  if (res.status === 422) throw new DemoApiError("invalid", detail ?? "Please check the inputs and try again.");
  if (res.status === 429) throw new DemoApiError("rate_limited", "Too many predictions in a short time. Please wait a moment and try again.");
  throw new DemoApiError("unavailable", UNAVAILABLE);
}

export const getDemoSchema = (slug: string, signal?: AbortSignal) =>
  request<DemoSchema>(`/api/projects/${encodeURIComponent(slug)}/demo`, { signal });

export const runPrediction = (slug: string, inputs: Record<string, FieldValue>, signal?: AbortSignal) =>
  request<PredictResponse>(`/api/projects/${encodeURIComponent(slug)}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inputs }),
    signal,
  });
