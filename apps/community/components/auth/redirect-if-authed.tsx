"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./auth-provider";
import { LoadingScreen } from "./loading-screen";

/** Wraps public auth pages: already-logged-in members are sent to the feed. */
export function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authed") router.replace("/");
  }, [status, router]);

  if (status === "loading") return <LoadingScreen />;
  if (status === "authed") return <LoadingScreen />;
  return <>{children}</>;
}
