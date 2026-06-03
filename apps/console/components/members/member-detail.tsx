"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/ui/role-badge";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { avatarIdx } from "@/lib/avatar";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";
import { roleAtLeast } from "@/lib/api/types";
import type { components, CurrentUser, Role } from "@/lib/api/types";

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: "OWNER", label: "OWNER · 소유자" },
  { value: "MANAGER", label: "MANAGER · 관리자" },
  { value: "MEMBER", label: "MEMBER · 멤버" },
];

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: "mail" | "calendar" | "refresh" | "members";
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon name={icon} size={16} className="mt-px shrink-0 text-ink-3" />
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-medium text-ink-3">{label}</div>
        <div className="bl-tnum mt-0.5 break-words text-[13.5px] text-ink">{children}</div>
      </div>
    </div>
  );
}

/** T-UM-02/03/04/05 — member detail with role + management actions. */
export function MemberDetail({
  member,
  currentUser,
  onChangeRole,
  onResetPassword,
  onDelete,
}: {
  member: components["schemas"]["UserEntity"];
  currentUser: CurrentUser | null;
  onChangeRole: (role: Role) => Promise<void>;
  onResetPassword: () => void;
  onDelete: () => void;
}) {
  const [roleBusy, setRoleBusy] = useState(false);

  const isSelf = currentUser?.id === member.id;
  const isOwner = roleAtLeast(currentUser?.role, "OWNER");
  const isManager = roleAtLeast(currentUser?.role, "MANAGER");

  // T-UM-03: only an OWNER can change roles, and never their own.
  const canChangeRole = isOwner && !isSelf;
  // T-UM-04/05: MANAGER+ can act on others who aren't OWNER.
  const canManage = isManager && !isSelf && member.role !== "OWNER";

  async function handleRole(next: string) {
    if (next === member.role) return;
    setRoleBusy(true);
    try {
      await onChangeRole(next as Role);
    } finally {
      setRoleBusy(false);
    }
  }

  return (
    <Card className="flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* header */}
      <div className="border-b border-line px-5 py-4">
        <div className="flex items-start gap-3.5">
          <Avatar name={member.username} idx={avatarIdx(member.id)} size={44} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5">
              <h2 className="truncate text-[19px] font-bold tracking-tight text-ink">
                {member.username}
              </h2>
              <RoleBadge role={member.role} />
              {isSelf && <Badge tone="accent">나</Badge>}
            </div>
            <div className="mt-1 truncate text-[12.5px] text-ink-3">
              {member.email || "이메일 없음"}
            </div>
          </div>
        </div>
      </div>

      {/* body */}
      <div className="min-h-0 flex-1 overflow-auto px-5 py-4">
        {/* basic info */}
        <section>
          <h3 className="mb-1 text-[12px] font-bold uppercase tracking-wide text-ink-3">
            기본 정보
          </h3>
          <div className="divide-y divide-line">
            <InfoRow icon="mail" label="이메일">
              {member.email || "—"}
            </InfoRow>
            <InfoRow icon="calendar" label="가입일">
              {formatDate(member.createdAt)}
            </InfoRow>
            <InfoRow icon="refresh" label="최근 수정일">
              {formatDate(member.updatedAt)}
            </InfoRow>
          </div>
        </section>

        {/* role management (T-UM-03) */}
        {canChangeRole && (
          <section className="mt-6">
            <Label htmlFor="member-role">권한 조정</Label>
            <Select
              id="member-role"
              value={member.role}
              onChange={handleRole}
              disabled={roleBusy}
              options={ROLE_OPTIONS}
            />
            <p className="mt-1.5 text-[12px] text-ink-3">
              권한 변경은 즉시 적용돼요. OWNER만 조정할 수 있어요.
            </p>
          </section>
        )}

        {/* danger zone (T-UM-04/05) */}
        {canManage && (
          <section className="mt-6">
            <h3 className="mb-2 text-[12px] font-bold uppercase tracking-wide text-ink-3">
              회원 관리
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" icon="key" onClick={onResetPassword}>
                비밀번호 리셋
              </Button>
              <Button variant="danger" size="sm" icon="trash" onClick={onDelete}>
                회원 삭제
              </Button>
            </div>
          </section>
        )}

        {/* T-UM-06 / T-UM-07 — not yet implemented on the backend. */}
        <section className="mt-6">
          <h3 className="mb-2 text-[12px] font-bold uppercase tracking-wide text-ink-3">
            정지·차단 / 활동 이력
          </h3>
          <div
            className={cn(
              "rounded-[8px] border border-dashed border-line px-3.5 py-3 text-[12.5px] text-ink-3",
            )}
          >
            준비 중인 기능이에요. (T-UM-06 정지·차단, T-UM-07 활동 이력)
          </div>
        </section>
      </div>
    </Card>
  );
}
