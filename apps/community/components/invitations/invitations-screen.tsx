"use client";

// 받은 초대함 — U-PJ-03 / U-PJ-04 (✅). 공간·게시판의 PENDING 초대 수락/거절.
// 초대 row는 스칼라(id, spaceId/boardId, role, status)만 옵니다. 이름은 상세
// 조회로 best-effort 해석하되, 비공개라 못 읽으면 짧은 id로 폴백합니다.
import { useCallback, useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { RoleBadge } from "@/components/ui/role-badge";
import { useToast } from "@/components/ui/toast";
import {
  spacesControllerFindMyInvitations,
  spacesControllerFindOne,
  spacesControllerAcceptInvitation,
  spacesControllerDeclineInvitation,
  boardsControllerFindMyInvitations,
  boardsControllerFindOne,
  boardsControllerAcceptInvitation,
  boardsControllerDeclineInvitation,
} from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { avatarIdx } from "@/lib/avatar";
import type { Role } from "@/lib/api/types";

type Kind = "space" | "board";

interface InviteRow {
  kind: Kind;
  /** Invitation/membership id used to accept/decline. */
  id: string;
  /** Target space/board id. */
  targetId: string;
  name: string;
  role: Role;
}

export function InvitationsScreen() {
  const toast = useToast();
  const [rows, setRows] = useState<InviteRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setRows(null);
    try {
      const [spaceInvites, boardInvites] = await Promise.all([
        spacesControllerFindMyInvitations({ client }).then(r => r.data!),
        boardsControllerFindMyInvitations({ client }).then(r => r.data!),
      ]);

      const resolved = await Promise.all([
        ...spaceInvites.map(async (inv): Promise<InviteRow> => {
          const name = await spacesControllerFindOne({ client, path: { id: inv.spaceId } })
            .then(r => r.data!.name)
            .catch(() => `공간 ${inv.spaceId.slice(0, 6)}`);
          return { kind: "space", id: inv.id, targetId: inv.spaceId, name, role: inv.role };
        }),
        ...boardInvites.map(async (inv): Promise<InviteRow> => {
          const name = await boardsControllerFindOne({ client, path: { id: inv.boardId } })
            .then(r => r.data!.name)
            .catch(() => `게시판 ${inv.boardId.slice(0, 6)}`);
          return { kind: "board", id: inv.id, targetId: inv.boardId, name, role: inv.role };
        }),
      ]);

      setRows(resolved);
    } catch (err) {
      setRows([]);
      setError(err instanceof ApiError ? err.message : "초대를 불러오지 못했어요.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function act(row: InviteRow, accept: boolean) {
    setBusyId(row.id);
    try {
      if (row.kind === "space") {
        await (accept
          ? spacesControllerAcceptInvitation({ client, path: { invitationId: row.id } })
          : spacesControllerDeclineInvitation({ client, path: { invitationId: row.id } }));
      } else {
        await (accept
          ? boardsControllerAcceptInvitation({ client, path: { invitationId: row.id } })
          : boardsControllerDeclineInvitation({ client, path: { invitationId: row.id } }));
      }
      toast.success(accept ? "초대를 수락했어요." : "초대를 거절했어요.");
      setRows((prev) => prev?.filter((r) => r.id !== row.id) ?? null);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "처리하지 못했어요.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto flex max-w-[640px] flex-col gap-5">
      <header>
        <h1 className="text-xl font-bold tracking-tight text-ink">받은 초대함</h1>
        <p className="mt-1 text-[13.5px] text-ink-3">
          공간·게시판에서 받은 초대를 수락하거나 거절할 수 있어요.
        </p>
      </header>

      {rows === null ? (
        <div className="flex justify-center py-16">
          <Spinner size={22} />
        </div>
      ) : error ? (
        <EmptyState
          tone="danger"
          title="불러오기 실패"
          description={error}
          action={
            <Button size="sm" variant="secondary" icon="refresh" onClick={load}>
              다시 시도
            </Button>
          }
        />
      ) : rows.length === 0 ? (
        <EmptyState
          icon="inbox"
          title="받은 초대가 없어요"
          description="새 초대가 오면 여기에 표시돼요."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div
              key={`${row.kind}-${row.id}`}
              className="flex items-center gap-3 rounded-[11px] border border-line bg-surface-1 p-4"
            >
              <Avatar name={row.name} idx={avatarIdx(row.targetId)} size={40} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[11.5px] font-semibold text-ink-3">
                    <Icon name={row.kind === "space" ? "spaces" : "boards"} size={13} />
                    {row.kind === "space" ? "공간" : "게시판"}
                  </span>
                  <RoleBadge role={row.role} />
                </div>
                <div className="mt-0.5 truncate text-[14px] font-bold text-ink">
                  {row.name}
                </div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <Button
                  variant="primary"
                  size="sm"
                  icon="check"
                  disabled={busyId === row.id}
                  onClick={() => act(row, true)}
                >
                  수락
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busyId === row.id}
                  onClick={() => act(row, false)}
                >
                  거절
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
