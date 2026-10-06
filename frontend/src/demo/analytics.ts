export type DemoEventName =
  | "demo_opened"
  | "demo_prediction_started"
  | "demo_prediction_completed"
  | "demo_error";

export interface DemoEventProps {
  project: string;
  type?: string;
  source?: "button" | "deep_link";
  durationMs?: number;
  error?: string;
}

/**
 * Single place to hook up analytics. Nothing is sent anywhere by default.
 *
 * Option 1: listen for the DOM event from anywhere:
 *   window.addEventListener("portfolio:demo", (e) => console.log((e as CustomEvent).detail));
 * Option 2: call your provider right here, e.g.
 *   plausible(name, { props }) or gtag("event", name, props)
 */
export function trackDemo(name: DemoEventName, props: DemoEventProps): void {
  window.dispatchEvent(new CustomEvent("portfolio:demo", { detail: { name, ...props } }));
}
