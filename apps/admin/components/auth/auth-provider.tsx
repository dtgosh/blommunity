"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiError } from "@/lib/api/errors";
import { clearToken, decodeAdminToken, getToken, setToken } from "@/lib/api/token";
import { adminsControllerFindOne } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import type { CurrentAdmin } from "@/lib/api/types";

type AuthStatus = "loading" | "authed" | "guest";

interface AuthContextValue {
  status: AuthStatus;
  user: CurrentAdmin | null;
  /** Persist a freshly issued JWT, resolve the profile, mark the session authed. */
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<CurrentAdmin | null>(null);

  // Hydrate from any stored token on first mount.
  useEffect(() => {
    let cancelled = false;
    const token = getToken();
    if (!token) {
      setStatus("guest");
      return;
    }
    void resolveAdmin(token).then((resolved) => {
      if (cancelled) return;
      if (resolved) {
        setUser(resolved);
        setStatus("authed");
      } else {
        clearToken();
        setUser(null);
        setStatus("guest");
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (token: string) => {
    setToken(token);
    const resolved = await resolveAdmin(token);
    if (!resolved) {
      clearToken();
      setUser(null);
      setStatus("guest");
      throw new ApiError(401, "로그인에 실패했어요. 다시 시도해 주세요.");
    }
    setUser(resolved);
    setStatus("authed");
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setStatus("guest");
  }, []);

  const value = useMemo(
    () => ({ status, user, login, logout }),
    [status, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
