const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "";

export interface ContactPayload { name: string; email: string; message: string; website?: string }
export type ContactResult =
  | { ok: true }
  | { ok: false; kind: "validation" | "rate_limited" | "server" | "offline"; message: string };

export async function sendContact(payload: ContactPayload): Promise<ContactResult> {
  try {
    const res = await fetch(`${BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { ok: true };
    const body = (await res.json().catch(() => ({}))) as { detail?: unknown };
    const detail = typeof body.detail === "string" ? body.detail : undefined;
    if (res.status === 422) return { ok: false, kind: "validation", message: detail ?? "Please check the form and try again." };
    if (res.status === 429) return { ok: false, kind: "rate_limited", message: "Too many messages from this connection. Please try again later." };
    return { ok: false, kind: "server", message: detail ?? "The server could not save your message." };
  } catch {
    return { ok: false, kind: "offline", message: "The contact service is unreachable right now." };
  }
}
