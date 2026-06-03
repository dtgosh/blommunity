"use client";

// 회원 관리 — T-UM-01~05 (✅). T-UM-06 정지·차단 · T-UM-07 활동 이력 📅
import { useMemo, useState } from "react";
import { useFetchList } from "@blommunity/frontend-core/hooks";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/auth/auth-provider";
import {
  usersControllerFindAll,
  usersControllerAssignRole,
  usersControllerResetPassword,
  usersControllerRemoveMember,
} from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { Role } from "@/lib/api/types";
import { MemberListItem } from "./member-list-item";
import { MemberDetail } from "./member-detail";
import { ResetPasswordModal } from "./reset-password-modal";

export function MembersScreen() {
  const toast = useToast();
  const { user } = useAuth();

  const {
    data: members,
    error: listError,
    reload,
    setData: setMembers,
    selectedId,
    setSelectedId,
    selected,
  } = useFetchList(
    () => usersControllerFindAll({ client }).then((r) => r.data!),
    { errorMessage: "회원 목록을 불러오지 못했어요." },
  );

  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [resetting, setResetting] = useState(false);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = members ?? [];
    if (!q) return all;
    return all.filter(
      (m) =>
        m.username.toLowerCase().includes(q) ||
        (m.email?.toLowerCase().includes(q) ?? false),
    );
  }, [members, query]);

  async function handleChangeRole(role: Role) {
    if (!selected) return;
    try {
      const updated = (await usersControllerAssignRole({ client, path: { id: selected.id }, body: { role } })).data!;
      setMembers((prev) =>
        prev?.map((m) => (m.id === updated.id ? updated : m)) ?? prev,
      );
      toast.success("권한을 변경했어요.");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "권한을 변경하지 못했어요.",
      );
      throw err;
    }
  }

  async function handleResetPassword(newPassword: string) {
    if (!selected) return;
    await usersControllerResetPassword({ client, path: { id: selected.id }, body: { newPassword } });
    toast.success("비밀번호를 재설정했어요.");
  }

  async function handleDelete() {
    if (!selected) return;
    const deletedId = selected.id;
    await usersControllerRemoveMember({ client, path: { id: deletedId } });
    toast.success("회원을 삭제했어요.");
    setMembers((prev) => prev?.filter((m) => m.id !== deletedId) ?? prev);
    setSelectedId((cur) => (cur === deletedId ? null : cur));
  }

  return (
    <div className="flex h-full flex-col gap-[18px] overflow-hidden p-4 lg:flex-row lg:p-[22px]">
      {/* Left — master list */}
      <div className="flex w-full shrink-0 flex-col max-lg:max-h-[42vh] lg:w-[326px]">
        <div className="mb-3.5 flex items-center">
          <h1 className="flex-1 text-base font-bold tracking-tight text-ink">
            회원{" "}
            {members && (
              <span className="bl-tnum font-semibold text-ink-3">
                {members.length}
              </span>
            )}
          </h1>
        </div>

        <div className="mb-3.5 flex h-[38px] items-center gap-2 rounded-[7px] border border-line-strong bg-surface-1 px-2.5">
          <Icon name="search" size={16} className="text-ink-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름·이메일 검색"
            aria-label="이름·이메일 검색"
            className="flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-3"
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-auto">
          {members === null ? (
            <div className="flex justify-center py-10">
              <Spinner size={22} />
            </div>
          ) : listError ? (
            <EmptyState
              tone="danger"
              title="불러오기 실패"
              description={listError}
              action={
                <Button
                  size="sm"
                  variant="secondary"
                  icon="refresh"
                  onClick={() => reload(true)}
                >
                  다시 시도
                </Button>
              }
            />
          ) : list.length === 0 ? (
            <EmptyState
              icon="members"
              title={query ? "검색 결과가 없어요" : "아직 회원이 없어요"}
              description={
                query
                  ? `‘${query}’와 일치하는 회원이 없어요.`
                  : "이 워크스페이스에 회원이 없어요."
              }
            />
          ) : (
            list.map((m) => (
              <MemberListItem
                key={m.id}
                member={m}
                selected={m.id === selectedId}
                onClick={() => setSelectedId(m.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right — detail */}
      {selected ? (
        <MemberDetail
          member={selected}
          currentUser={user}
          onChangeRole={handleChangeRole}
          onResetPassword={() => setResetting(true)}
          onDelete={() => setDeleting(true)}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-[10px] border border-line bg-surface-1">
          <EmptyState
            icon="members"
            title="회원을 선택하세요"
            description="왼쪽 목록에서 회원을 선택하면 상세 정보가 보여요."
          />
        </div>
      )}

      {/* Modals */}
      <ResetPasswordModal
        open={resetting}
        member={selected}
        onClose={() => setResetting(false)}
        onSubmit={handleResetPassword}
      />
      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={handleDelete}
        title="회원을 삭제할까요?"
        description={
          selected ? `‘${selected.username}’ 회원을 삭제합니다.` : ""
        }
        confirmLabel="삭제"
      />
    </div>
  );
}
