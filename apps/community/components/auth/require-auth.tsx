"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./auth-provider";
import { LoadingScreen } from "./loading-screen";

/**
 * Route guard for authenticated console screens. Unauthenticated users are sent
 * to /login. This is a UX guard only — the backend enforces real authorization.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "guest") router.replace("/login");
  }, [status, router]);

  if (status !== "authed") return <LoadingScreen />;
  return <>{children}</>;
}
