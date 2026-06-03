"use client";

import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/role-badge";
import { avatarIdx } from "@/lib/avatar";
import type { components } from "@/lib/api/types";

export function MemberListItem({
  member,
  selected,
  onClick,
}: {
  member: components["schemas"]["UserEntity"];
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected}
      className={cn(
        "flex w-full items-center gap-3 rounded-[9px] border px-3 py-2.5 text-left transition-colors",
        selected
          ? "border-accent bg-accent/5"
          : "border-line bg-surface-1 hover:border-line-strong hover:bg-surface-2",
      )}
    >
      <Avatar name={member.username} idx={avatarIdx(member.id)} size={36} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[13.5px] font-semibold text-ink">
            {member.username}
          </span>
        </div>
        {member.email && (
          <span className="block truncate text-[12px] text-ink-3">
            {member.email}
          </span>
        )}
      </div>
      <RoleBadge role={member.role} />
    </button>
  );
}
