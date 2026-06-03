"use client";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/icon";
import { VisibilityBadge } from "@/components/ui/role-badge";
import type { components } from "@/lib/api/types";

/** A row in the boards master list, showing the parent space name. */
export function BoardListItem({
  board,
  spaceName,
  selected,
  onClick,
}: {
  board: components["schemas"]["BoardEntity"];
  spaceName?: string;
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
      <div className="mb-1.5 flex items-center gap-2">
        <span
          className={cn(
            "flex size-[30px] shrink-0 items-center justify-center rounded-[7px]",
            board.visibility === "PRIVATE"
              ? "bg-surface-2 text-ink-2"
              : "bg-accent text-on-accent",
          )}
        >
          {board.visibility === "PRIVATE" ? (
            <Icon name="lock" size={15} />
          ) : (
            <Icon name="boards" size={16} />
          )}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
          {board.name}
        </span>
        <VisibilityBadge visibility={board.visibility} size="sm" />
      </div>
      <div className="flex items-center gap-1.5 text-[12px] text-ink-3">
        <Icon name="spaces" size={12} />
        <span className="truncate">{spaceName ?? "다른 공간"}</span>
      </div>
    </button>
  );
}
