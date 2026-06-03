import type { IconName } from "@/components/ui/icon";

/** Backend-readiness of the screen (per docs/feature-spec §5.3). */
export type NavStatus = "live" | "soon";

export interface NavEntry {
  key: string;
  label: string;
  href: string;
  icon: IconName;
  status: NavStatus;
  featureIds: string[];
}

// 커뮤니티 상단 내비게이션 (회원 시점 IA — feature-spec §5.3).
export const NAV: NavEntry[] = [
  {
    key: "home",
    label: "홈",
    href: "/",
    icon: "boards",
    status: "live",
    featureIds: ["T-SP-02", "T-BD-02"],
  },
  {
    key: "invitations",
    label: "받은 초대함",
    href: "/invitations",
    icon: "inbox",
    status: "live",
    featureIds: ["U-PJ-03", "U-PJ-04"],
  },
  {
    key: "search",
    label: "검색",
    href: "/search",
    icon: "search",
    status: "soon",
    featureIds: ["U-PT-12"],
  },
];

/** Whether `href` is the active nav entry for the current pathname. */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
