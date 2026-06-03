"use client";

import { Card } from "@/components/ui/card";
import { VisibilityBadge } from "@/components/ui/role-badge";
import { formatDate } from "@/lib/format";
import type { components } from "@/lib/api/types";

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 border-b border-line py-[11px] last:border-0">
      <span className="w-20 shrink-0 text-[12.5px] font-medium text-ink-3">
        {label}
      </span>
      <span className="text-[13px] font-medium text-ink">{children}</span>
    </div>
  );
}

/**
 * Overview — only fields the API actually returns for a space (scalars). Member
 * counts / owner are intentionally absent: GET /spaces/:id includes no relations
 * and there is no member-list endpoint yet (T-SP-13 📅).
 */
export function OverviewTab({ space }: { space: components["schemas"]["SpaceEntity"] }) {
  return (
    <div className="flex flex-col gap-6 p-5">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_1fr] md:items-start">
        <div>
          <div className="mb-2 text-[12px] font-semibold tracking-wide text-ink-3">
            설명
          </div>
          <p className="max-w-prose text-sm leading-relaxed text-ink">
            {space.description || "아직 설명이 없어요."}
          </p>
        </div>
        <Card className="px-4 py-1">
          <MetaRow label="생성일">{formatDate(space.createdAt)}</MetaRow>
          <MetaRow label="공개 범위">
            <VisibilityBadge visibility={space.visibility} />
          </MetaRow>
        </Card>
      </div>
    </div>
  );
}
