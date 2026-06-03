"use client";

import { createAuth } from "@blommunity/frontend-core/auth";
import { ApiError, type CurrentAdmin } from "@blommunity/types";
import { adminsControllerFindOne } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { clearToken, decodeAdminToken, getToken, setToken } from "@/lib/api/token";

/**
 * Build a CurrentAdmin from token claims, enriched with the fetched profile.
 * There is no GET /admins/me (A-AC-04 is 📅), but the token carries the admin's
 * id, so we read the full profile via GET /admins/:id (A-AM-02).
 */
async function resolveAdmin(token: string): Promise<CurrentAdmin | null> {
  const claims = decodeAdminToken(token);
  if (!claims) return null;
  try {
    const profile = (await adminsControllerFindOne({ client, path: { id: claims.id } })).data!;
    return {
      id: claims.id,
      name: profile.name ?? claims.id,
      email: profile.email,
      role: profile.role ?? claims.role,
    };
  } catch (err) {
    // 401 → token is invalid/expired; treat as logged out.
    if (err instanceof ApiError && err.status === 401) return null;
    // Other failures (e.g. backend down): still honor the token's claims so the
    // operator isn't kicked out for a transient error.
    return { id: claims.id, name: claims.id, email: null, role: claims.role };
  }
}

const auth = createAuth<CurrentAdmin>({
  tokens: { getToken, setToken, clearToken },
  resolveUser: resolveAdmin,
  homePath: "/admin",
});

export const { AuthProvider, useAuth, RequireAuth, RedirectIfAuthed } = auth;
