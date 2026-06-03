"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { VisibilityBadge } from "@/components/ui/role-badge";
import type { components } from "@/lib/api/types";

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
        <div
          className={
            "text-[13.5px] font-semibold " +
            (danger ? "text-danger" : "text-ink")
          }
        >
          {title}
        </div>
        <div className="mt-0.5 text-[12.5px] leading-relaxed text-ink-3">
          {desc}
        </div>
      </div>
      {control}
    </div>
  );
}

/** Settings tab (T-SP-04/05). Edit and delete are surfaced here for managers. */
export function SettingsTab({
  space,
  canManage,
  onEdit,
  onDelete,
}: {
  space: components["schemas"]["SpaceEntity"];
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (!canManage) {
    return (
      <div className="p-5">
        <EmptyState
          icon="lock"
          title="설정 권한이 없어요"
          description="공간의 OWNER 또는 MANAGER만 설정을 변경할 수 있어요."
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl p-5">
      <SetRow
        title="공간 이름"
        desc="멤버에게 보이는 공간의 이름이에요."
        control={
          <Button variant="secondary" size="sm" icon="edit" onClick={onEdit}>
            {space.name}
          </Button>
        }
      />
      <SetRow
        title="공개 범위"
        desc={
          space.visibility === "PUBLIC"
            ? "누구나 검색하고 가입할 수 있어요."
            : "초대받은 사람만 들어올 수 있어요."
        }
        control={<VisibilityBadge visibility={space.visibility} />}
      />

      <div className="mt-5 rounded-[10px] border border-danger-bd bg-danger-bg px-4">
        <SetRow
          danger
          title="공간 삭제"
          desc="공간과 그 안의 모든 게시판·글·댓글이 삭제돼요. 되돌릴 수 없어요."
          control={
            <Button variant="danger" size="sm" icon="trash" onClick={onDelete}>
              삭제
            </Button>
          }
        />
      </div>
    </div>
  );
}
