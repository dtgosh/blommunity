"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { VisibilityBadge } from "@/components/ui/role-badge";
import { MemberPlaceholder } from "@/components/shared/member-placeholder";
import { InvitePanel } from "@/components/shared/invite-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/format";
import {
  boardsControllerFindInvitations,
  boardsControllerCreateInvitation,
  boardsControllerRevokeInvitation,
} from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { roleAtLeast } from "@/lib/api/types";
import type { components, CurrentUser } from "@/lib/api/types";

type TabKey = "overview" | "members" | "invite" | "settings";
const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "개요" },
  { key: "members", label: "멤버" },
  { key: "invite", label: "초대" },
  { key: "settings", label: "설정" },
];

function SetRow({
  title,
  desc,
  control,
  danger,
}: {
  title: string;
  desc: string;
  control: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-line py-4 last:border-0">
      <div className="min-w-0 flex-1">
        <div className={"text-[13.5px] font-semibold " + (danger ? "text-danger" : "text-ink")}>
          {title}
        </div>
        <div className="mt-0.5 text-[12.5px] leading-relaxed text-ink-3">{desc}</div>
      </div>
      {control}
    </div>
  );
}

export function BoardPanel({
  board,
  spaceName,
  currentUser,
  onEdit,
  onDelete,
}: {
  board: components["schemas"]["BoardEntity"];
  spaceName?: string;
  currentUser: CurrentUser | null;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [tab, setTab] = useState<TabKey>("overview");

  // Per-board role isn't exposed by the API; gate on tenant JWT role as a proxy.
  // Server enforces the real per-board OWNER/MANAGER rule (403 otherwise).
  const canManage = roleAtLeast(currentUser?.role, "MANAGER");

  return (
    <Card className="flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* header */}
      <div className="border-b border-line px-5 py-4">
        <div className="flex items-start gap-3.5">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-[10px]",
              board.visibility === "PRIVATE"
                ? "bg-surface-2 text-ink-2"
                : "bg-accent text-on-accent",
            )}
          >
            <Icon name={board.visibility === "PRIVATE" ? "lock" : "boards"} size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <h2 className="truncate text-[19px] font-bold tracking-tight text-ink">
                {board.name}
              </h2>
              <VisibilityBadge visibility={board.visibility} />
            </div>
            <div className="bl-tnum mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink-3">
              <span className="inline-flex items-center gap-1.5">
                <Icon name="spaces" size={13} />
                {spaceName ?? "다른 공간"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="calendar" size={13} />
                {formatDate(board.createdAt)}
              </span>
            </div>
          </div>
          {canManage && (
            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" size="sm" icon="edit" onClick={onEdit}>
                수정
              </Button>
              <Button variant="danger" size="sm" icon="trash" onClick={onDelete}>
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
        {tab === "overview" && (
          <div className="flex flex-col gap-6 p-5">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_1fr] md:items-start">
              <div>
                <div className="mb-2 text-[12px] font-semibold tracking-wide text-ink-3">
                  설명
                </div>
                <p className="max-w-prose text-sm leading-relaxed text-ink">
                  {board.description || "아직 설명이 없어요."}
                </p>
              </div>
              <Card className="px-4 py-1">
                <div className="flex gap-3 border-b border-line py-[11px]">
                  <span className="w-20 shrink-0 text-[12.5px] font-medium text-ink-3">
                    공간
                  </span>
                  <span className="text-[13px] font-medium text-ink">
                    {spaceName ?? "다른 공간"}
                  </span>
                </div>
                <div className="flex gap-3 border-b border-line py-[11px]">
                  <span className="w-20 shrink-0 text-[12.5px] font-medium text-ink-3">
                    생성일
                  </span>
                  <span className="text-[13px] font-medium text-ink">
                    {formatDate(board.createdAt)}
                  </span>
                </div>
                <div className="flex gap-3 py-[11px]">
                  <span className="w-20 shrink-0 text-[12.5px] font-medium text-ink-3">
                    공개 범위
                  </span>
                  <VisibilityBadge visibility={board.visibility} />
                </div>
              </Card>
            </div>
          </div>
        )}
        {tab === "members" && <MemberPlaceholder featureIds="T-BD-13·14·15" />}
        {tab === "invite" && (
          <InvitePanel
            targetId={board.id}
            targetName={board.name}
            canManage={canManage}
            listInvitations={() => boardsControllerFindInvitations({ client, path: { id: board.id } }).then(r => r.data!)}
            invite={(userId) => boardsControllerCreateInvitation({ client, path: { id: board.id }, body: { inviteeId: userId } })}
            revoke={(invitationId) => boardsControllerRevokeInvitation({ client, path: { id: board.id, invitationId } })}
          />
        )}
        {tab === "settings" &&
          (canManage ? (
            <div className="max-w-2xl p-5">
              <SetRow
                title="게시판 이름"
                desc="멤버에게 보이는 게시판의 이름이에요."
                control={
                  <Button variant="secondary" size="sm" icon="edit" onClick={onEdit}>
                    {board.name}
                  </Button>
                }
              />
              <SetRow
                title="공개 범위"
                desc={
                  board.visibility === "PUBLIC"
                    ? "누구나 보고 가입할 수 있어요."
                    : "초대받은 사람만 들어올 수 있어요."
                }
                control={<VisibilityBadge visibility={board.visibility} />}
              />
              <div className="mt-5 rounded-[10px] border border-danger-bd bg-danger-bg px-4">
                <SetRow
                  danger
                  title="게시판 삭제"
                  desc="게시판과 그 안의 모든 글·댓글이 삭제돼요. 되돌릴 수 없어요."
                  control={
                    <Button variant="danger" size="sm" icon="trash" onClick={onDelete}>
                      삭제
                    </Button>
                  }
                />
              </div>
            </div>
          ) : (
            <div className="p-5">
              <EmptyState
                icon="lock"
                title="설정 권한이 없어요"
                description="게시판의 OWNER 또는 MANAGER만 설정을 변경할 수 있어요."
              />
            </div>
          ))}
      </div>
    </Card>
  );
}
