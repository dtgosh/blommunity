"use client";

// 사이드바형 앱 셸은 @blommunity/frontend-core/shell 의 SidebarShell 이 담당하고,
// 여기서는 어드민 고유 값(브랜드·브레드크럼·프로필 경로·displayName)과 인증/테마만 주입한다.
import { SidebarShell } from "@blommunity/frontend-core/shell";
import { useAuth } from "@/components/auth/auth-provider";
import { useTheme } from "@/components/theme/theme-provider";
import { NAV, isNavActive } from "./nav";

export function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <SidebarShell
      nav={NAV}
      isNavActive={isNavActive}
      brandTitle="Blommunity"
      brandSubtitle="운영자 어드민"
      breadcrumbRoot="운영자 어드민"
      profileHref="/admin/profile"
      user={
        user
          ? { displayName: user.name, email: user.email, role: user.role }
          : null
      }
      theme={theme}
      onToggleTheme={toggle}
      logout={logout}
    >
      {children}
    </SidebarShell>
  );
}
