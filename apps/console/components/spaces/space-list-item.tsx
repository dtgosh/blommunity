"use client";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/icon";
import { VisibilityBadge } from "@/components/ui/role-badge";
import type { components } from "@/lib/api/types";

/** A row in the spaces master list. */
export function SpaceListItem({
  space,
  selected,
  onClick,
}: {
  space: components["schemas"]["SpaceEntity"];
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected}
      className={cn(
        "relative w-full rounded-[9px] border p-3.5 text-left transition-colors",
        selected
          ? "border-accent bg-accent-weak shadow-[0_0_0_1px_var(--bl-accent)]"
          : "border-line bg-surface-1 hover:bg-surface-2",
      )}
    >
      {selected && (
        <span className="absolute left-0 bottom-3 top-3 w-[3px] rounded-full bg-accent" />
      )}
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cn(
            "flex size-[30px] shrink-0 items-center justify-center rounded-[7px]",
            space.visibility === "PRIVATE"
              ? "bg-surface-2 text-ink-2"
              : "bg-accent text-on-accent",
          )}
        >
          {space.visibility === "PRIVATE" ? (
            <Icon name="lock" size={15} />
          ) : (
            <span className="text-sm font-bold">{space.name.charAt(0)}</span>
          )}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
          {space.name}
        </span>
        <VisibilityBadge visibility={space.visibility} size="sm" />
      </div>
      {space.description ? (
        <p className="line-clamp-2 text-[12px] leading-relaxed text-ink-3">
          {space.description}
        </p>
      ) : (
        <p className="text-[12px] italic text-ink-3">설명이 없어요</p>
      )}
    </button>
  );
}
