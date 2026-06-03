import { createTokenManager } from "@blommunity/frontend-core/token";
import { decodeJwtSegment, type UserTokenPayload } from "@blommunity/types";

// USER token only (the admin app uses ADMIN tokens on a different key — X-SC-02).
// console uses "bl-console-token"; community uses a separate key to avoid
// collision if both apps are served under the same origin.
export const { getToken, setToken, clearToken } = createTokenManager("bl-community-token");

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
