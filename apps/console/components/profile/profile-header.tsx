"use client";

// 프로필 헤더 — 공통 컴포넌트에 콘솔 사용자(아이디 기반)를 매핑.
import { ProfileHeader as BaseProfileHeader } from "@blommunity/frontend-core/profile";
import type { CurrentUser } from "@/lib/api/types";

export function ProfileHeader({ user }: { user: CurrentUser }) {
  return (
    <BaseProfileHeader
      displayName={user.username}
      email={user.email ?? null}
      role={user.role}
      avatarSeed={user.username}
    />
  );
}
