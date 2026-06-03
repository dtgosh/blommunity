"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/avatar";
import { Icon, type IconName } from "@/components/ui/icon";
import { useTheme } from "@/components/theme/theme-provider";
import { useAuth } from "@/components/auth/auth-provider";
import { avatarIdx } from "@/lib/avatar";
import { NAV, isNavActive } from "./nav";

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

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const current = NAV.find((n) => isNavActive(pathname, n.href));

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
          운영자 어드민
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
          onClick={toggle}
        />
        <TopIconButton icon="bell" title="알림" dot />
        <TopIconButton icon="help" title="도움말" />
        <div className="mx-1.5 h-[22px] w-px bg-line" />
        <Link
          href="/admin/profile"
          title={user?.name ?? "내 계정"}
          aria-label="내 계정"
          className="rounded-full p-0.5"
        >
          <Avatar
            name={user?.name ?? "?"}
            idx={user ? avatarIdx(user.name) : 0}
            size={30}
          />
        </Link>
      </div>
    </header>
  );
}
