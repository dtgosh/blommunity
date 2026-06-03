import { createTokenManager } from "@blommunity/frontend-core/token";
import { decodeJwtSegment, type UserTokenPayload } from "@blommunity/types";

// USER token only (the console never holds ADMIN tokens — X-SC-02). The admin
// app uses a different key on a different origin, so they never mix.
export const { getToken, setToken, clearToken } = createTokenManager("bl-console-token");

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
