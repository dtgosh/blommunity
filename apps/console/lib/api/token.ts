import type { UserTokenPayload } from "./types";
import { decodeJwtSegment } from "@blommunity/types";

// USER token only (the console never holds ADMIN tokens — X-SC-02). The admin
// app uses a different key on a different origin, so they never mix.
const TOKEN_KEY = "bl-console-token";

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
 * Decode (NOT verify) a USER JWT. Verification is the server's job; the console
 * only reads claims to drive UX. Returns null on any malformed/non-user token.
 */
export function decodeUserToken(token: string): UserTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(decodeJwtSegment(parts[1])) as Partial<UserTokenPayload>;
    if (payload.type !== "user" || !payload.id || !payload.role || !payload.tenantId) return null;
    return payload as UserTokenPayload;
  } catch {
    return null;
  }
}
