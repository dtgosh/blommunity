"use client";

export { useTheme } from "@blommunity/ui/theme-provider";
import { ThemeProvider as Base } from "@blommunity/ui/theme-provider";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Base wrapperClass="cm-page" darkMode="attribute">
      {children}
    </Base>
  );
}
