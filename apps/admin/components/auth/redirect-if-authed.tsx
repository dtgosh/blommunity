"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./auth-provider";
import { LoadingScreen } from "./loading-screen";

/** Wraps public auth pages: already-logged-in operators are sent to the admin. */
export function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authed") router.replace("/admin");
  }, [status, router]);

  if (status === "loading") return <LoadingScreen />;
  if (status === "authed") return <LoadingScreen />;
  return <>{children}</>;
}
