// 프로필 헤더 — 공통 컴포넌트에 운영자(이름 기반, 아바타 시드는 id)를 매핑.
import { ProfileHeader as BaseProfileHeader } from "@blommunity/frontend-core/profile";
import type { CurrentAdmin } from "@/lib/api/types";

export function ProfileHeader({ admin }: { admin: CurrentAdmin }) {
  return (
    <BaseProfileHeader
      displayName={admin.name}
      email={admin.email}
      role={admin.role}
      avatarSeed={admin.id}
    />
  );
}
