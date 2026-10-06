import { isPlaceholder } from "../lib/format";

/** Wraps text; in dev mode, marks TODO_ placeholders with a dashed underline. */
export function Ph({ children }: { children: string }) {
  return <span className={import.meta.env.DEV && isPlaceholder(children) ? "ph" : undefined}>{children}</span>;
}
