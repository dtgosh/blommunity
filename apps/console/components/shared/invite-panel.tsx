"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingRegion } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/auth/auth-provider";
import { usersControllerFindAll } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { avatarIdx } from "@/lib/avatar";
import type { components } from "@/lib/api/types";

/** A pending-invitation row carries only an id + invitee userId (no nested user). */
export interface InvitationRow {
  id: string;
  userId: string;
}

/**
 * Reusable invite panel for both spaces and boards (T-SP/T-BD-07·08·09). The
 * backend invite takes a user UUID; we pick from the tenant's users (GET /users)
 * and resolve invitee names from that list since invitation rows have no nested
 * user. Existing ACTIVE members can't be filtered (no member-list API) — the
 * server rejects duplicates and we surface that as a toast.
 */
export function InvitePanel({
  targetId,
  targetName,
  canManage,
  listInvitations,
  invite,
  revoke,
}: {
  /** Stable id of the space/board — used as the data-load dependency. */
  targetId: string;
  targetName: string;
  canManage: boolean;
  listInvitations: () => Promise<InvitationRow[]>;
  invite: (userId: string) => Promise<unknown>;
  revoke: (invitationId: string) => Promise<unknown>;
}) {
  const toast = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<components["schemas"]["UserEntity"][] | null>(null);
  const [invites, setInvites] = useState<InvitationRow[] | null>(null);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canManage) return;
    let cancelled = false;
    setError(null);
    Promise.all([usersControllerFindAll({ client }).then(r => r.data!), listInvitations()])
      .then(([u, inv]) => {
        if (cancelled) return;
        setUsers(u);
        setInvites(inv);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "목록을 불러오지 못했어요.");
        setUsers([]);
        setInvites([]);
      });
    return () => {
      cancelled = true;
    };
    // Keyed on targetId (stable) so switching the selected space/board reloads,
    // but new callback identities on every render don't trigger refetch loops.
    // (listInvitations is intentionally excluded — see comment above.)
  }, [canManage, targetId]);

  const nameById = useMemo(() => {
    const map = new Map<string, string>();
    (users ?? []).forEach((u) => map.set(u.id, u.username));
    return map;
  }, [users]);

  if (!canManage) {
    return (
      <div className="p-5">
        <EmptyState
          icon="lock"
          title="초대 권한이 없어요"
          description="OWNER 또는 MANAGER만 멤버를 초대할 수 있어요."
        />
      </div>
    );
  }

  if (users === null || invites === null) {
    return <LoadingRegion />;
  }

  const invitedIds = new Set(invites.map((i) => i.userId));
  const candidates = users.filter(
    (u) =>
      u.id !== currentUser?.id &&
      !invitedIds.has(u.id) &&
      u.username.toLowerCase().includes(query.trim().toLowerCase()),
  );

  async function doInvite(userId: string) {
    setBusyId(userId);
    try {
      await invite(userId);
      setInvites(await listInvitations());
      toast.success("초대를 보냈어요.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "초대하지 못했어요.");
    } finally {
      setBusyId(null);
    }
  }

  async function doRevoke(row: InvitationRow) {
    setBusyId(row.id);
    try {
      await revoke(row.id);
      setInvites((prev) => prev?.filter((i) => i.id !== row.id) ?? null);
      toast.success("초대를 회수했어요.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "회수하지 못했어요.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6 p-5">
      {error && <p className="text-[13px] text-danger">{error}</p>}

      <div>
        <div className="mb-1 text-[13.5px] font-bold text-ink">멤버 초대</div>
        <p className="mb-3 text-[12.5px] text-ink-3">
          테넌트 회원 중에서 ‘{targetName}’에 초대할 사람을 고르세요.
        </p>
        <div className="mb-3 flex h-[38px] items-center gap-2 rounded-lg border border-line-strong bg-surface-1 px-3">
          <Icon name="search" size={16} className="text-ink-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름으로 검색"
            aria-label="회원 이름으로 검색"
            className="flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-3"
          />
        </div>
        <Card>
          {candidates.length === 0 ? (
            <div className="px-4 py-6 text-center text-[13px] text-ink-3">
              초대할 수 있는 회원이 없어요.
            </div>
          ) : (
            candidates.slice(0, 8).map((u, i) => (
              <div
                key={u.id}
                className={
                  "flex items-center gap-3 px-4 py-2.5 " +
                  (i < Math.min(candidates.length, 8) - 1 ? "border-b border-line" : "")
                }
              >
                <Avatar name={u.username} idx={avatarIdx(u.username)} size={30} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">
                  {u.username}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  icon="userPlus"
                  disabled={busyId === u.id}
                  onClick={() => doInvite(u.id)}
                >
                  초대
                </Button>
              </div>
            ))
          )}
        </Card>
        {candidates.length > 8 && (
          <p className="mt-2 text-[12px] text-ink-3">
            검색으로 더 많은 회원을 찾을 수 있어요. (상위 8명 표시)
          </p>
        )}
      </div>

      <div>
        <div className="mb-3 text-[13.5px] font-bold text-ink">
          보낸 초대{" "}
          <span className="bl-tnum font-semibold text-ink-3">{invites.length}</span>
        </div>
        {invites.length === 0 ? (
          <Card className="px-4 py-6">
            <p className="text-center text-[13px] text-ink-3">대기 중인 초대가 없어요.</p>
          </Card>
        ) : (
          <Card>
            {invites.map((inv, i) => {
              const name = nameById.get(inv.userId) ?? inv.userId;
              return (
                <div
                  key={inv.id}
                  className={
                    "flex items-center gap-3 px-4 py-2.5 " +
                    (i < invites.length - 1 ? "border-b border-line" : "")
                  }
                >
                  <Avatar name={name} idx={avatarIdx(name)} size={30} />
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink">
                    {name}
                  </span>
                  <Button
                    variant="danger"
                    size="sm"
                    icon="x"
                    disabled={busyId === inv.id}
                    onClick={() => doRevoke(inv)}
                  >
                    회수
                  </Button>
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </div>
  );
}
