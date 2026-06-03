"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@blommunity/ui/cn";
import { Avatar } from "@blommunity/ui/avatar";
import { Badge } from "@blommunity/ui/badge";
import { BrandMark } from "@blommunity/ui/brand-mark";
import { Icon, type IconName } from "@blommunity/ui/icon";
import { ROLE_TONE } from "@blommunity/ui/role-badge";
import { avatarIdx } from "@blommunity/ui/avatar-util";
import type { Role } from "@blommunity/types";
import type { NavEntry } from "./nav";

/** 사이드바/탑바가 표시하는 최소 사용자 정보(앱별 user 모델을 정규화해 주입). */
export interface ShellUser {
  displayName: string;
  email: string | null;
  role: Role;
}

export interface SidebarShellProps {
  children: ReactNode;
  /** 내비게이션 항목과 활성 판정(앱별 NAV·isNavActive 주입). */
  nav: NavEntry[];
  isNavActive: (pathname: string, href: string) => boolean;
  /** 사이드바 헤더 브랜드. showSwitcher=true 면 chevron 달린 버튼(테넌트 스위처 자리). */
  brandTitle: string;
  brandSubtitle: string;
  showSwitcher?: boolean;
  /** 탑바 브레드크럼 루트 라벨. */
  breadcrumbRoot: string;
  /** 프로필 링크 경로. 예: "/console/profile". */
  profileHref: string;
  /** 로그아웃 후 이동할 경로. 기본 "/login". */
  loginPath?: string;
  user: ShellUser | null;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  logout: () => void;
}

function NavItem({
  item,
  active,
  onNavigate,
}: {
  item: NavEntry;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-[38px] items-center gap-2.5 rounded-[7px] pl-3 pr-2.5 text-[13.5px] tracking-[-0.01em] transition-colors",
        active
          ? "bg-accent-weak font-semibold text-accent-text"
          : "font-medium text-ink-2 hover:bg-surface-2",
      )}
    >
      {active && (
        <span className="absolute -left-2 bottom-2 top-2 w-[3px] rounded-full bg-accent" />
      )}
      <Icon name={item.icon} size={18} strokeWidth={active ? 2 : 1.75} />
      <span className="flex-1">{item.label}</span>
      {item.status === "soon" && (
        <span className="rounded-full bg-surface-2 px-1.5 py-[1px] text-[10px] font-semibold text-ink-3">
          준비 중
        </span>
      )}
    </Link>
  );
}

function BrandHeader({
  title,
  subtitle,
  showSwitcher,
}: {
  title: string;
  subtitle: string;
  showSwitcher?: boolean;
}) {
  const inner = (
    <>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent">
        <BrandMark size={19} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-semibold leading-tight text-ink">
          {title}
        </span>
        <span className="block text-[11.5px] leading-tight text-ink-3">
          {subtitle}
        </span>
      </span>
      {showSwitcher && (
        <Icon name="chevronDown" size={15} className="text-ink-3" />
      )}
    </>
  );

  return (
    <div className="border-b border-line px-3.5 pb-3 pt-4">
      {showSwitcher ? (
        <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-surface-2">
          {inner}
        </button>
      ) : (
        <div className="flex w-full items-center gap-2.5 px-2 py-1.5">
          {inner}
        </div>
      )}
    </div>
  );
}

function Sidebar({
  mobileOpen,
  onClose,
  props,
}: {
  mobileOpen: boolean;
  onClose: () => void;
  props: SidebarShellProps;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    nav,
    isNavActive,
    brandTitle,
    brandSubtitle,
    showSwitcher,
    profileHref,
    loginPath = "/login",
    user,
    logout,
  } = props;

  function onLogout() {
    logout();
    router.replace(loginPath);
  }

  return (
    <>
      {/* mobile backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 lg:hidden",
          mobileOpen ? "block" : "hidden",
        )}
      />

      <aside
        className={cn(
          "z-50 flex h-full w-60 shrink-0 flex-col border-r border-line bg-surface-1",
          "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:transition-transform max-lg:duration-200",
          mobileOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
        )}
      >
        <BrandHeader
          title={brandTitle}
          subtitle={brandSubtitle}
          showSwitcher={showSwitcher}
        />

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          {nav.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              active={isNavActive(pathname, item.href)}
              onNavigate={onClose}
            />
          ))}
        </nav>

        {/* User footer */}
        <div className="flex items-center gap-1 border-t border-line p-3">
          <Link
            href={profileHref}
            onClick={onClose}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-[7px] text-left hover:bg-surface-2"
          >
            <Avatar
              name={user?.displayName ?? "?"}
              idx={user ? avatarIdx(user.displayName) : 0}
              size={30}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold leading-tight text-ink">
                {user?.displayName ?? "—"}
              </span>
              <span className="block truncate text-[11px] leading-tight text-ink-3">
                {user?.email ?? "내 프로필"}
              </span>
            </span>
            {user && (
              <Badge tone={ROLE_TONE[user.role]} size="sm">
                {user.role}
              </Badge>
            )}
          </Link>
          <button
            type="button"
            onClick={onLogout}
            title="로그아웃"
            aria-label="로그아웃"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink-3 hover:bg-surface-2 hover:text-ink-2"
          >
            <Icon name="logout" size={17} />
          </button>
        </div>
      </aside>
    </>
  );
}

function TopIconButton({
  icon,
  title,
  onClick,
  dot,
  className,
}: {
  icon: IconName;
  title: string;
  onClick?: () => void;
  dot?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={cn(
        "relative flex size-[34px] items-center justify-center rounded-[7px] text-ink-2 transition-colors hover:bg-surface-2",
        className,
      )}
    >
      <Icon name={icon} size={18} />
      {dot && (
        <span className="absolute right-[7px] top-[7px] size-[7px] rounded-full bg-accent shadow-[0_0_0_2px_var(--bl-surface-1)]" />
      )}
    </button>
  );
}

function Topbar({
  onMenu,
  props,
}: {
  onMenu: () => void;
  props: SidebarShellProps;
}) {
  const pathname = usePathname();
  const { nav, isNavActive, breadcrumbRoot, profileHref, user, theme, onToggleTheme } = props;
  const current = nav.find((n) => isNavActive(pathname, n.href));

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-line bg-surface-1 px-5">
      <TopIconButton
        icon="menu"
        title="메뉴 열기"
        onClick={onMenu}
        className="lg:hidden"
      />

      {/* breadcrumbs */}
      <div className="flex min-w-0 flex-1 items-center gap-[7px]">
        <span className="whitespace-nowrap text-[13.5px] font-medium text-ink-3">
          {breadcrumbRoot}
        </span>
        {current && (
          <>
            <Icon name="chevronRight" size={14} className="text-ink-3" />
            <span className="whitespace-nowrap text-[13.5px] font-semibold text-ink">
              {current.label}
            </span>
          </>
        )}
      </div>

      {/* right cluster */}
      <div className="flex items-center gap-0.5">
        <TopIconButton
          icon={theme === "dark" ? "sun" : "moon"}
          title="테마 전환"
          onClick={onToggleTheme}
        />
        <TopIconButton icon="bell" title="알림" dot />
        <TopIconButton icon="help" title="도움말" />
        <div className="mx-1.5 h-[22px] w-px bg-line" />
        <Link
          href={profileHref}
          title={user?.displayName ?? "내 계정"}
          aria-label="내 계정"
          className="rounded-full p-0.5"
        >
          <Avatar
            name={user?.displayName ?? "?"}
            idx={user ? avatarIdx(user.displayName) : 0}
            size={30}
          />
        </Link>
      </div>
    </header>
  );
}

/**
 * console·admin 이 공유하는 사이드바형 앱 셸. 레이아웃·모바일 드로어·내비게이션·
 * 사용자 푸터·탑바를 한 곳에 두고, 앱별 차이(브랜드·브레드크럼·프로필 경로·
 * displayName·NAV·테마/인증 연결)는 props 로 주입한다. 커뮤니티(header/footer
 * 형)는 별도 셸을 유지한다.
 */
export function SidebarShell(props: SidebarShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        props={props}
      />
      <main className="flex min-w-0 flex-1 flex-col bg-surface-0">
        <Topbar onMenu={() => setMobileOpen(true)} props={props} />
        <div className="min-h-0 flex-1 overflow-auto">{props.children}</div>
      </main>
    </div>
  );
}
