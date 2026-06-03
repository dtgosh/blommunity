"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BrandMark } from "@/components/ui/brand-mark";
import { Icon } from "@/components/ui/icon";
import { ROLE_TONE } from "@/components/ui/role-badge";
import { useAuth } from "@/components/auth/auth-provider";
import { avatarIdx } from "@/lib/avatar";
import { NAV, isNavActive, type NavEntry } from "./nav";

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

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function onLogout() {
    logout();
    router.replace("/login");
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
        {/* Tenant header / switcher */}
        <div className="border-b border-line px-3.5 pb-3 pt-4">
          <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-surface-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent">
              <BrandMark size={19} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-semibold leading-tight text-ink">
                내 커뮤니티
              </span>
              <span className="block text-[11.5px] leading-tight text-ink-3">
                테넌트 콘솔
              </span>
            </span>
            <Icon name="chevronDown" size={15} className="text-ink-3" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          {NAV.map((item) => (
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
            href="/console/profile"
            onClick={onClose}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-[7px] text-left hover:bg-surface-2"
          >
            <Avatar
              name={user?.username ?? "?"}
              idx={user ? avatarIdx(user.username) : 0}
              size={30}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold leading-tight text-ink">
                {user?.username ?? "—"}
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
