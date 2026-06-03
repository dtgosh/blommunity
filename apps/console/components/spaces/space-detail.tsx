"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { VisibilityBadge } from "@/components/ui/role-badge";
import { formatDate } from "@/lib/format";
import type { components, CurrentUser } from "@/lib/api/types";
import { roleAtLeast } from "@/lib/api/types";
import { OverviewTab } from "./tabs/overview-tab";
import { MembersTab } from "./tabs/members-tab";
import { InviteTab } from "./tabs/invite-tab";
import { SettingsTab } from "./tabs/settings-tab";

type TabKey = "overview" | "members" | "invite" | "settings";
const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "개요" },
  { key: "members", label: "멤버" },
  { key: "invite", label: "초대" },
  { key: "settings", label: "설정" },
];

export function SpacePanel({
  space,
  currentUser,
  onEdit,
  onDelete,
}: {
  space: components["schemas"]["SpaceEntity"];
  currentUser: CurrentUser | null;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [tab, setTab] = useState<TabKey>("overview");

  // The API exposes no per-space membership/role, so we gate management actions
  // on the user's TENANT-level role from the JWT as a proxy. This is UX only —
  // the server enforces the real per-space OWNER/MANAGER rule (403 otherwise).
  const canManage = roleAtLeast(currentUser?.role, "MANAGER");

  return (
    <Card className="flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* header */}
      <div className="border-b border-line px-5 py-4">
        <div className="flex items-start gap-3.5">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-[10px]",
              space.visibility === "PRIVATE"
                ? "bg-surface-2 text-ink-2"
                : "bg-accent text-on-accent",
            )}
          >
            {space.visibility === "PRIVATE" ? (
              <Icon name="lock" size={20} />
            ) : (
              <span className="text-xl font-bold">{space.name.charAt(0)}</span>
            )}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <h2 className="truncate text-[19px] font-bold tracking-tight text-ink">
                {space.name}
              </h2>
              <VisibilityBadge visibility={space.visibility} />
            </div>
            <div className="bl-tnum mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink-3">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="calendar" size={13} />
                {formatDate(space.createdAt)}
              </span>
            </div>
          </div>
          {canManage && (
            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" size="sm" icon="edit" onClick={onEdit}>
                수정
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon="trash"
                onClick={onDelete}
              >
                삭제
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* tabs */}
      <div className="flex gap-1 border-b border-line px-5">
        {TABS.map((t) => {
          const on = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "relative px-2 py-3 text-[13.5px] transition-colors",
                on ? "font-bold text-ink" : "font-medium text-ink-3 hover:text-ink-2",
              )}
            >
              {t.label}
              {on && (
                <span className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-accent" />
              )}
            </button>
          );
        })}
      </div>

      {/* content */}
      <div className="min-h-0 flex-1 overflow-auto">
        {tab === "overview" && <OverviewTab space={space} />}
        {tab === "members" && <MembersTab />}
        {tab === "invite" && <InviteTab space={space} canManage={canManage} />}
        {tab === "settings" && (
          <SettingsTab
            space={space}
            canManage={canManage}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </div>
    </Card>
  );
}
