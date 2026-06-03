import type { IconName } from "@/components/ui/icon";

/** Backend-readiness of the screen (per docs/feature-spec §5.1). */
export type NavStatus =
  | "live" // ✅ backend ready
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

// 운영자 어드민 내비게이션 (feature-spec §5.1 화면 인벤토리).
export const NAV: NavEntry[] = [
  {
    key: "dashboard",
    label: "대시보드",
    href: "/admin",
    icon: "dashboard",
    status: "soon",
    featureIds: ["A-ST-01", "A-ST-02"],
  },
  {
    key: "operators",
    label: "운영자 관리",
    href: "/admin/operators",
    icon: "shieldCheck",
    status: "live",
    featureIds: ["A-AM-01~07"],
  },
  {
    key: "tenants",
    label: "사업자 관리",
    href: "/admin/tenants",
    icon: "building",
    status: "live",
    featureIds: ["A-TN-01~04"],
  },
  {
    key: "audit",
    label: "감사 로그",
    href: "/admin/audit",
    icon: "activity",
    status: "soon",
    featureIds: ["A-AL-02"],
  },
  {
    key: "profile",
    label: "내 프로필",
    href: "/admin/profile",
    icon: "profile",
    status: "live",
    featureIds: ["A-AC-03~04"],
  },
];

/** Whether `href` is the active nav entry for the current pathname. */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}
