import { createTokenManager } from "@blommunity/frontend-core/token";
import { decodeJwtSegment, type AdminTokenPayload } from "@blommunity/types";

// ADMIN token only (the operator admin never holds USER tokens — X-SC-02). The
// tenant console uses a different key on a different origin, so they never mix.
export const { getToken, setToken, clearToken } = createTokenManager("bl-admin-token");

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
