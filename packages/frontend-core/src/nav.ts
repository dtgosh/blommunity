import type { IconName } from "@blommunity/ui/icon";

/** 화면의 백엔드 준비 상태 (docs/feature-spec §5 / sitemap §2). */
export type NavStatus =
  | "live" // ✅ backend ready
  | "soon"; // 📅 not yet implemented on the backend

export interface NavEntry {
  key: string;
  label: string;
  href: string;
  icon: IconName;
  status: NavStatus;
  /** 이 화면이 커버하는 feature ID (추적성). */
  featureIds: string[];
}

/**
 * `href` 가 현재 pathname 의 활성 nav 항목인지. `homeHref`(앱 루트, 예: "/console",
 * "/admin", "/")는 정확히 일치할 때만 활성으로 본다(접두 매칭 제외).
 */
export function isNavActive(
  pathname: string,
  href: string,
  homeHref: string,
): boolean {
  if (href === homeHref) return pathname === homeHref;
  return pathname === href || pathname.startsWith(href + "/");
}
