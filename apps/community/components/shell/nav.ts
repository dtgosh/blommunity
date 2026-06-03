import { isNavActive as isNavActiveFor, type NavEntry } from "@blommunity/frontend-core/nav";

export type { NavEntry, NavStatus } from "@blommunity/frontend-core/nav";

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
  return isNavActiveFor(pathname, href, "/");
}
