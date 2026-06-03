"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/ui/role-badge";
import { Select, type SelectOption } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { avatarIdx } from "@/lib/avatar";
import { formatDate } from "@/lib/format";
import { adminStatus, roleAtLeast } from "@/lib/api/types";
import type { components, CurrentAdmin, AssignableRole } from "@/lib/api/types";

const ROLE_OPTIONS: SelectOption[] = [
  { value: "MEMBER", label: "MEMBER · 일반 운영자" },
  { value: "MANAGER", label: "MANAGER · 매니저" },
];

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-[12.5px] text-ink-3">{label}</span>
      <span className="bl-tnum text-[13px] font-medium text-ink-2">{value}</span>
    </div>
  );
}

export function OperatorDetail({
  operator,
  currentAdmin,
  onEdit,
  onApprove,
  onRevokeApproval,
  onAssignRole,
  onRemove,
}: {
  operator: components["schemas"]["AdminEntity"];
  currentAdmin: CurrentAdmin | null;
  onEdit: () => void;
  onApprove: () => Promise<void>;
  onRevokeApproval: () => Promise<void>;
  onAssignRole: (role: AssignableRole) => Promise<void>;
  onRemove: () => Promise<void>;
}) {
  const isSelf = currentAdmin?.id === operator.id;
  const isPending = adminStatus(operator) === "pending";
  const isMemberRole = operator.role === "MEMBER";

  const canManage = roleAtLeast(currentAdmin?.role, "MANAGER");
  const canEdit = canManage || isSelf;
  // A-AM-04/05: only MEMBER operators are approved/revoked, by MANAGER+.
  const canApprove = canManage && isMemberRole && isPending;
  const canRevoke = canManage && isMemberRole && !isPending && !isSelf;
  // A-AM-06: OWNER only, target not OWNER, not self.
  const canAssignRole =
    currentAdmin?.role === "OWNER" && operator.role !== "OWNER" && !isSelf;
  // A-AM-07: MANAGER+, not self.
  const canRemove = canManage && !isSelf;

  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <div className="flex flex-1 flex-col overflow-auto rounded-[10px] border border-line bg-surface-1">
      {/* header */}
      <div className="flex items-start gap-4 border-b border-line p-5">
        <Avatar name={operator.name} idx={avatarIdx(operator.id)} size={52} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-[17px] font-bold text-ink">
              {operator.name}
            </h2>
            <RoleBadge role={operator.role} />
            <Badge tone={isPending ? "warning" : "success"} size="sm">
              {isPending ? "승인 대기" : "승인됨"}
            </Badge>
            {isSelf && (
              <Badge tone="neutral" size="sm">
                나
              </Badge>
            )}
          </div>
          <p className="mt-0.5 truncate text-[13px] text-ink-3">{operator.email}</p>
        </div>
        {canEdit && (
          <Button variant="secondary" size="sm" icon="edit" onClick={onEdit}>
            정보 수정
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-5 p-5">
        {/* meta */}
        <div className="rounded-[10px] border border-line bg-surface-2/40 px-4 py-2">
          <InfoRow label="가입일" value={formatDate(operator.createdAt)} />
          <InfoRow
            label="승인일"
            value={operator.approvedAt ? formatDate(operator.approvedAt) : "—"}
          />
        </div>

        {/* role */}
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-ink-2">
            권한
          </label>
          {canAssignRole ? (
            <Select
              value={operator.role}
              onChange={(value) => onAssignRole(value as AssignableRole)}
              options={ROLE_OPTIONS}
            />
          ) : (
            <div className="flex h-[42px] items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 text-[12.5px] text-ink-3">
              <RoleBadge role={operator.role} />
              <span>
                {operator.role === "OWNER"
                  ? "OWNER 권한은 변경할 수 없어요."
                  : isSelf
                    ? "본인 권한은 변경할 수 없어요."
                    : "OWNER만 권한을 바꿀 수 있어요."}
              </span>
            </div>
          )}
        </div>

        {/* approval actions */}
        {(canApprove || canRevoke) && (
          <div className="flex flex-col gap-2.5">
            {canApprove && (
              <Button variant="primary" icon="check" onClick={onApprove}>
                승인하기
              </Button>
            )}
            {canRevoke && (
              <Button variant="secondary" icon="refresh" onClick={onRevokeApproval}>
                승인 회수
              </Button>
            )}
          </div>
        )}

        {/* danger */}
        {canRemove && (
          <div className="border-t border-line pt-4">
            <Button
              variant="danger"
              icon="trash"
              onClick={() => setConfirmRemove(true)}
            >
              운영자 삭제
            </Button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        onConfirm={onRemove}
        title="운영자를 삭제할까요?"
        description={`‘${operator.name}’ 운영자를 삭제합니다.`}
        confirmLabel="삭제"
      />
    </div>
  );
}
