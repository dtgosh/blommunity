"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

/**
 * App shell — Sidebar + (Topbar over scrollable content).
 * Ported from console-system.jsx `Shell`. On narrow widths the sidebar collapses
 * into an off-canvas drawer toggled by the Topbar menu button.
 */
export function Shell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="flex min-w-0 flex-1 flex-col bg-surface-0">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
