"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/ui/brand-mark";
import { Icon } from "@/components/ui/icon";
import { useTheme } from "@/components/theme/theme-provider";
import { useAuth } from "@/components/auth/auth-provider";
import { avatarIdx } from "@/lib/avatar";
import { NAV, isNavActive } from "./nav";

/** Member-facing top bar: brand, primary nav, search/theme, write + account. */
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function onLogout() {
    logout();
    setMenuOpen(false);
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface-1/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1080px] items-center gap-3 px-4 lg:px-6">
        {/* brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-[9px] bg-accent">
            <BrandMark size={18} />
          </span>
          <span className="hidden text-[15px] font-extrabold tracking-tight text-ink sm:block">
            커뮤니티
          </span>
        </Link>

        {/* primary nav */}
        <nav className="ml-2 hidden items-center gap-0.5 md:flex">
          {NAV.map((item) => {
            const active = isNavActive(pathname, item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center gap-1.5 rounded-[7px] px-3 text-[13.5px] font-semibold transition-colors",
                  active
                    ? "bg-accent-weak text-accent-text"
                    : "text-ink-2 hover:bg-surface-2",
                )}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
                {item.status === "soon" && (
                  <span className="rounded-full bg-surface-2 px-1.5 py-px text-[10px] font-semibold text-ink-3">
                    준비 중
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* actions */}
        <button
          type="button"
          onClick={toggle}
          title="테마 전환"
          aria-label="테마 전환"
          className="flex size-9 items-center justify-center rounded-[7px] text-ink-2 hover:bg-surface-2"
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
        </button>

        <Link href="/write" className="hidden sm:block">
          <Button variant="primary" size="sm" icon="penLine">
            글쓰기
          </Button>
        </Link>

        {/* account menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="내 계정"
            aria-expanded={menuOpen}
            className="flex items-center rounded-full p-0.5 hover:bg-surface-2"
          >
            <Avatar
              name={user?.username ?? "?"}
              idx={user ? avatarIdx(user.id) : 0}
              size={30}
            />
          </button>

          {menuOpen && (
            <>
              <div
                aria-hidden
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 top-11 z-50 w-52 overflow-hidden rounded-xl border border-line bg-surface-1 py-1 shadow-[var(--shadow-pop)]">
                <div className="border-b border-line px-3.5 py-2.5">
                  <div className="truncate text-[13.5px] font-semibold text-ink">
                    {user?.username ?? "—"}
                  </div>
                  <div className="truncate text-[12px] text-ink-3">
                    {user?.email ?? "회원"}
                  </div>
                </div>
                <MenuLink
                  href="/me"
                  icon="profile"
                  label="내 프로필"
                  onClick={() => setMenuOpen(false)}
                />
                <MenuLink
                  href="/invitations"
                  icon="inbox"
                  label="받은 초대함"
                  onClick={() => setMenuOpen(false)}
                />
                <MenuLink
                  href="/write"
                  icon="penLine"
                  label="글쓰기"
                  onClick={() => setMenuOpen(false)}
                />
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full items-center gap-2.5 border-t border-line px-3.5 py-2.5 text-left text-[13px] text-ink-2 hover:bg-surface-2"
                >
                  <Icon name="logout" size={16} className="text-ink-3" />
                  로그아웃
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* mobile nav row */}
      <nav className="flex items-center gap-0.5 overflow-x-auto border-t border-line px-3 py-1.5 md:hidden">
        {NAV.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-8 shrink-0 items-center gap-1.5 rounded-[7px] px-3 text-[13px] font-semibold transition-colors",
                active
                  ? "bg-accent-weak text-accent-text"
                  : "text-ink-2 hover:bg-surface-2",
              )}
            >
              <Icon name={item.icon} size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

function MenuLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: Parameters<typeof Icon>[0]["name"];
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-ink-2 hover:bg-surface-2"
    >
      <Icon name={icon} size={16} className="text-ink-3" />
      {label}
    </Link>
  );
}
