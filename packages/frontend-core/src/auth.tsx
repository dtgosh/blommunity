"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@blommunity/types";
import { LoadingScreen } from "@blommunity/ui/loading-screen";
import { setUnauthorizedHandler } from "./auth-events";
import type { TokenManager } from "./token";

export type AuthStatus = "loading" | "authed" | "guest";

export interface AuthContextValue<TUser> {
  status: AuthStatus;
  user: TUser | null;
  /** 발급된 JWT를 저장하고 프로필을 resolve 한 뒤 세션을 authed 로 만든다. */
  login: (token: string) => Promise<void>;
  logout: () => void;
}

export interface CreateAuthOptions<TUser> {
  /** 앱별 토큰 저장소(키로 격리). createTokenManager 로 만든다. */
  tokens: TokenManager;
  /**
   * 토큰으로 현재 사용자 프로필을 resolve 한다. 토큰이 무효/만료면 null 을
   * 반환해야 한다. (앱별로 디코드 함수·엔드포인트·user 모델이 다르므로 인자로 받음)
   */
  resolveUser: (token: string) => Promise<TUser | null>;
  /** 로그인된 사용자를 보낼 홈 경로 (RedirectIfAuthed). 예: "/console". */
  homePath: string;
  /** 미인증 사용자를 보낼 로그인 경로 (RequireAuth). 기본 "/login". */
  loginPath?: string;
  /** 프로필 resolve 실패 시 throw 할 메시지. */
  loginFailedMessage?: string;
}

/**
 * 세 앱이 공유하는 클라이언트 인증 상태머신을 생성한다. 공유: 토큰 하이드레이션,
 * login/logout, 401→guest 처리, 라우트 가드. 앱별 차이(토큰 종류·엔드포인트·
 * 디코드·user 타입·리다이렉트 경로)는 모두 옵션 인자로 주입한다(병합 금지).
 */
export function createAuth<TUser>(options: CreateAuthOptions<TUser>) {
  const {
    tokens,
    resolveUser,
    homePath,
    loginPath = "/login",
    loginFailedMessage = "로그인에 실패했어요. 다시 시도해 주세요.",
  } = options;

  const AuthContext = createContext<AuthContextValue<TUser> | null>(null);

  function useAuth(): AuthContextValue<TUser> {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
  }

  function AuthProvider({ children }: { children: ReactNode }) {
    const [status, setStatus] = useState<AuthStatus>("loading");
    const [user, setUser] = useState<TUser | null>(null);

    // Hydrate from any stored token on first mount.
    useEffect(() => {
      let cancelled = false;
      const token = tokens.getToken();
      if (!token) {
        setStatus("guest");
        return;
      }
      void resolveUser(token).then((resolved) => {
        if (cancelled) return;
        if (resolved) {
          setUser(resolved);
          setStatus("authed");
        } else {
          tokens.clearToken();
          setUser(null);
          setStatus("guest");
        }
      });
      return () => {
        cancelled = true;
      };
      // tokens·resolveUser 는 createAuth 클로저에서 고정(앱당 1회 생성)이므로 1회만 실행한다.
    }, []);

    const login = useCallback(async (token: string) => {
      tokens.setToken(token);
      const resolved = await resolveUser(token);
      if (!resolved) {
        tokens.clearToken();
        setUser(null);
        setStatus("guest");
        throw new ApiError(401, loginFailedMessage);
      }
      setUser(resolved);
      setStatus("authed");
    }, []);

    const logout = useCallback(() => {
      tokens.clearToken();
      setUser(null);
      setStatus("guest");
    }, []);

    // 전역 401 → 즉시 guest. 토큰 클리어는 createApiClient 인터셉터가 수행한다.
    useEffect(() => {
      setUnauthorizedHandler(logout);
      return () => setUnauthorizedHandler(null);
    }, [logout]);

    const value = useMemo(
      () => ({ status, user, login, logout }),
      [status, user, login, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }

  /** 인증된 화면 가드. 미인증이면 로그인으로 보낸다(UX 가드, 실제 인가는 서버). */
  function RequireAuth({ children }: { children: ReactNode }) {
    const { status } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (status === "guest") router.replace(loginPath);
    }, [status, router]);

    if (status !== "authed") return <LoadingScreen />;
    return <>{children}</>;
  }

  /** 공개 인증 페이지 가드. 이미 로그인했으면 홈으로 보낸다. */
  function RedirectIfAuthed({ children }: { children: ReactNode }) {
    const { status } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (status === "authed") router.replace(homePath);
    }, [status, router]);

    // loading 또는 authed 동안은 스피너(깜빡임 방지), guest 일 때만 콘텐츠.
    if (status !== "guest") return <LoadingScreen />;
    return <>{children}</>;
  }

  return { AuthContext, useAuth, AuthProvider, RequireAuth, RedirectIfAuthed };
}
