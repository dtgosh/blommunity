"use client";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/icon";
import { formatDate } from "@/lib/format";
import type { components } from "@/lib/api/types";

export function TenantListItem({
  tenant,
  selected,
  onClick,
}: {
  tenant: components["schemas"]["TenantEntity"];
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
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-surface-2 text-ink-2">
        <Icon name="building" size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-semibold text-ink">
          {tenant.name}
        </span>
        <span className="block truncate text-[12px] text-ink-3">
          생성 {formatDate(tenant.createdAt)}
        </span>
      </div>
    </button>
  );
}
