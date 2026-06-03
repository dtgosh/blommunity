"use client";

import { createContext, useCallback, useContext, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggle: () => {},
  setTheme: () => {},
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

const STORAGE_KEY = "bl-theme";

export function ThemeProvider({
  children,
  wrapperClass = "bl",
  darkMode = "class",
}: {
  children: React.ReactNode;
  /** 토큰 스코프 래퍼 클래스명. console/admin: "bl"(기본), community: "cm-page". */
  wrapperClass?: string;
  /** 다크 모드 적용 방식. "class": .dark 클래스 추가(기본), "attribute": data-theme="dark" 속성 추가. */
  darkMode?: "class" | "attribute";
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light") return stored;
    } catch {
      // localStorage가 차단된 환경(일부 브라우저 프라이버시 모드)에서는 무시
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    window.localStorage.setItem(STORAGE_KEY, t);
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const isDark = theme === "dark";
  const className = wrapperClass + " min-h-screen" + (darkMode === "class" && isDark ? " dark" : "");

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      <div
        className={className}
        {...(darkMode === "attribute" ? { "data-theme": isDark ? "dark" : "light" } : {})}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
