import type { AdminTokenPayload } from "./types";
import { decodeJwtSegment } from "@blommunity/types";

// ADMIN token only (the operator admin never holds USER tokens — X-SC-02). The
// tenant console uses a different key on a different origin, so they never mix.
const TOKEN_KEY = "bl-admin-token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

/**
 * Decode (NOT verify) an ADMIN JWT. Verification is the server's job; the admin
 * app only reads claims to drive UX. The backend signs `{ type, id, role }` with
 * no exp. Returns null on any malformed/non-admin token.
 */
export function decodeAdminToken(token: string): AdminTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(decodeJwtSegment(parts[1])) as Partial<AdminTokenPayload>;
    if (payload.type !== "admin" || !payload.id || !payload.role) return null;
    return payload as AdminTokenPayload;
  } catch {
    return null;
  }
}
