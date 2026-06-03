"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { VisibilityBadge } from "@/components/ui/role-badge";
import type { components } from "@/lib/api/types";

/** A board entry in the home feed — links to the board's post list. */
export function BoardCard({ board }: { board: components["schemas"]["BoardEntity"] }) {
  return (
    <Link
      href={`/boards/${board.id}`}
      className="group flex items-start gap-3 rounded-[11px] border border-line bg-surface-1 p-4 transition-colors hover:border-line-strong hover:bg-surface-2"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-accent-weak text-accent-text">
        <Icon name="boards" size={20} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[14.5px] font-bold text-ink group-hover:text-accent-text">
            {board.name}
          </h3>
          <VisibilityBadge visibility={board.visibility} />
        </div>
        <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-relaxed text-ink-3">
          {board.description || "게시판에 들어가 글을 확인해 보세요."}
        </p>
      </div>
      <Icon
        name="chevronRight"
        size={18}
        className="mt-1 shrink-0 text-ink-3 group-hover:text-accent-text"
      />
    </Link>
  );
}
