"use client";

import { createAuth } from "@blommunity/frontend-core/auth";
import { ApiError, type CurrentUser } from "@blommunity/types";
import { usersControllerFindOne } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { clearToken, decodeUserToken, getToken, setToken } from "@/lib/api/token";

/** Build a CurrentUser (member) from token claims, enriched with the profile. */
async function resolveUser(token: string): Promise<CurrentUser | null> {
  const claims = decodeUserToken(token);
  if (!claims) return null;
  try {
    const profile = (await usersControllerFindOne({ client, path: { id: claims.id } })).data!;
    return {
      id: claims.id,
      username: profile.username ?? claims.id,
      email: profile.email,
      role: profile.role ?? claims.role,
      tenantId: claims.tenantId,
    };
  } catch (err) {
    // 401 → token is invalid/expired; treat as logged out.
    if (err instanceof ApiError && err.status === 401) return null;
    // Other failures (e.g. backend down): still honor the token's claims so the
    // user isn't kicked out for a transient error.
    return {
      id: claims.id,
      username: claims.id,
      role: claims.role,
      tenantId: claims.tenantId,
    };
  }
}

const auth = createAuth<CurrentUser>({
  tokens: { getToken, setToken, clearToken },
  resolveUser,
  homePath: "/",
});

export const { AuthProvider, useAuth, RequireAuth, RedirectIfAuthed } = auth;
