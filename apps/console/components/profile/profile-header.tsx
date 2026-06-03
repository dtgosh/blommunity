"use client";

import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/role-badge";
import { avatarIdx } from "@/lib/avatar";
import type { CurrentUser } from "@/lib/api/types";

/** Profile header — avatar, username, email and role badge. */
export function ProfileHeader({ user }: { user: CurrentUser }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar name={user.username} idx={avatarIdx(user.username)} size={56} />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-lg font-semibold text-ink">
            {user.username}
          </h2>
          <RoleBadge role={user.role} />
        </div>
        {user.email ? (
          <p className="mt-0.5 truncate text-sm text-ink-2">{user.email}</p>
        ) : (
          <p className="mt-0.5 truncate text-sm text-ink-3">이메일 미설정</p>
        )}
      </div>
    </div>
  );
}
