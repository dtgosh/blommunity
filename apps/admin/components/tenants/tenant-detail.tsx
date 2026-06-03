"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatDate } from "@/lib/format";
import type { components } from "@/lib/api/types";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-[12.5px] text-ink-3">{label}</span>
      <span className="bl-tnum truncate text-[13px] font-medium text-ink-2">
        {value}
      </span>
    </div>
  );
}

export function TenantDetail({
  tenant,
  onEdit,
  onRemove,
}: {
  tenant: components["schemas"]["TenantEntity"];
  onEdit: () => void;
  onRemove: () => Promise<void>;
}) {
  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <div className="flex flex-1 flex-col overflow-auto rounded-[10px] border border-line bg-surface-1">
      {/* header */}
      <div className="flex items-start gap-4 border-b border-line p-5">
        <span className="flex size-[52px] shrink-0 items-center justify-center rounded-[12px] bg-surface-2 text-ink-2">
          <Icon name="building" size={26} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[17px] font-bold text-ink">{tenant.name}</h2>
          <p className="mt-0.5 truncate font-mono text-[12px] text-ink-3">
            {tenant.id}
          </p>
        </div>
        <Button variant="secondary" size="sm" icon="edit" onClick={onEdit}>
          이름 수정
        </Button>
      </div>

      <div className="flex flex-col gap-5 p-5">
        {/* meta */}
        <div className="rounded-[10px] border border-line bg-surface-2/40 px-4 py-2">
          <InfoRow label="생성일" value={formatDate(tenant.createdAt)} />
          <InfoRow label="테넌트 ID" value={tenant.id} />
        </div>

        {/* 준비 중 — 정지/사용량 */}
        <div className="rounded-[10px] border border-line bg-surface-1 p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[13px] font-semibold text-ink-2">운영 도구</span>
            <Badge tone="neutral" size="sm">
              A-TN-05·06
            </Badge>
            <Badge tone="warning" size="sm">
              준비 중
            </Badge>
          </div>
          <p className="text-[12.5px] leading-relaxed text-ink-3">
            테넌트 정지/재개와 사용량(사용자·게시물·스토리지) 조회는 관련 백엔드
            API가 준비되면 여기에 연결됩니다.
          </p>
        </div>

        {/* danger */}
        <div className="border-t border-line pt-4">
          <Button
            variant="danger"
            icon="trash"
            onClick={() => setConfirmRemove(true)}
          >
            테넌트 삭제
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        onConfirm={onRemove}
        title="테넌트를 삭제할까요?"
        description={`‘${tenant.name}’ 테넌트를 삭제합니다. 소속된 모든 데이터에 접근할 수 없게 돼요.`}
        confirmLabel="삭제"
      />
    </div>
  );
}
