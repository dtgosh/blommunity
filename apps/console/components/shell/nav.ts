import type { IconName } from "@/components/ui/icon";

/** Backend-readiness of the screen (per docs/sitemap.md §2 / feature-spec §5.2). */
export type NavStatus =
  | "live" // ✅ backend ready (wired in a later build step)
  | "soon"; // 📅 not yet implemented on the backend

export interface NavEntry {
  key: string;
  label: string;
  href: string;
  icon: IconName;
  status: NavStatus;
  /** Feature IDs this screen covers, for traceability. */
  featureIds: string[];
}

// Order mirrors BL_NAV in console-system.jsx.
export const NAV: NavEntry[] = [
  {
    key: "dashboard",
    label: "대시보드",
    href: "/console",
    icon: "dashboard",
    status: "soon",
    featureIds: ["T-OP-04"],
  },
  {
    key: "spaces",
    label: "공간 관리",
    href: "/console/spaces",
    icon: "spaces",
    status: "live",
    featureIds: ["T-SP-01~15"],
  },
  {
    key: "boards",
    label: "게시판 관리",
    href: "/console/boards",
    icon: "boards",
    status: "live",
    featureIds: ["T-BD-01~16"],
  },
  {
    key: "members",
    label: "회원 관리",
    href: "/console/members",
    icon: "members",
    status: "live",
    featureIds: ["T-UM-01~07"],
  },
  {
    key: "moderation",
    label: "신고·모더레이션",
    href: "/console/moderation",
    icon: "moderation",
    status: "soon",
    featureIds: ["T-OP-01~03"],
  },
  {
    key: "settings",
    label: "사이트 설정",
    href: "/console/settings",
    icon: "settings",
    status: "soon",
    featureIds: ["T-ST-01~05"],
  },
  {
    key: "profile",
    label: "내 프로필",
    href: "/console/profile",
    icon: "profile",
    status: "live",
    featureIds: ["T-AC-03~05"],
  },
];

/** Whether `href` is the active nav entry for the current pathname. */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/console") return pathname === "/console";
  return pathname === href || pathname.startsWith(href + "/");
}
