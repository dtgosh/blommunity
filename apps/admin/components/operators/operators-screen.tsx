"use client";

// 운영자 관리 — A-AM-01~07 (✅). 목록/필터/상세 + 승인·회수·권한임명·삭제·정보수정.
import { useMemo, useState } from "react";
import { useFetchList } from "@blommunity/frontend-core/hooks";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/auth/auth-provider";
import {
  adminsControllerFindAll,
  adminsControllerApprove,
  adminsControllerRevokeApproval,
  adminsControllerAssignRole,
  adminsControllerRemove,
} from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import type { AssignableRole } from "@/lib/api/types";
import { ApiError } from "@/lib/api/errors";
import { adminStatus } from "@/lib/api/types";
import type { components } from "@/lib/api/types";
import { OperatorListItem } from "./operator-list-item";
import { OperatorDetail } from "./operator-detail";
import { OperatorEditModal } from "./operator-edit-modal";

type Filter = "all" | "pending" | "approved";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "pending", label: "승인 대기" },
  { value: "approved", label: "승인됨" },
];

export function OperatorsScreen() {
  const toast = useToast();
  const { user: currentAdmin } = useAuth();

  const {
    data: operators,
    error: listError,
    reload,
    setData: setOperators,
    selectedId,
    setSelectedId,
    selected,
  } = useFetchList(
    () => adminsControllerFindAll({ client }).then((r) => r.data!),
    { errorMessage: "운영자 목록을 불러오지 못했어요." },
  );

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState(false);

  const counts = useMemo(() => {
    const all = operators ?? [];
    const pending = all.filter((o) => adminStatus(o) === "pending").length;
    return { all: all.length, pending, approved: all.length - pending };
  }, [operators]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (operators ?? []).filter((o) => {
      if (filter !== "all" && adminStatus(o) !== filter) return false;
      if (!q) return true;
      return (
        o.name.toLowerCase().includes(q) || o.email.toLowerCase().includes(q)
      );
    });
  }, [operators, filter, query]);

  async function handleApprove(op: components["schemas"]["AdminEntity"]) {
    try {
      await adminsControllerApprove({ client, path: { id: op.id } });
      toast.success("운영자를 승인했어요.");
      await reload();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "승인에 실패했어요.");
    }
  }

  async function handleRevoke(op: components["schemas"]["AdminEntity"]) {
    try {
      await adminsControllerRevokeApproval({ client, path: { id: op.id } });
      toast.success("승인을 회수했어요.");
      await reload();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "회수에 실패했어요.");
    }
  }

  async function handleAssignRole(op: components["schemas"]["AdminEntity"], role: AssignableRole) {
    try {
      await adminsControllerAssignRole({ client, path: { id: op.id }, body: { role } });
      toast.success("권한을 변경했어요.");
      await reload();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "권한 변경에 실패했어요.");
    }
  }

  async function handleRemove(op: components["schemas"]["AdminEntity"]) {
    try {
      await adminsControllerRemove({ client, path: { id: op.id } });
      toast.success("운영자를 삭제했어요.");
      if (selectedId === op.id) setSelectedId(null);
      await reload();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "삭제에 실패했어요.");
    }
  }

  function handleUpdated(updated: components["schemas"]["AdminEntity"]) {
    setOperators(
      (prev) => prev?.map((o) => (o.id === updated.id ? updated : o)) ?? null,
    );
  }

  return (
    <div className="flex h-full flex-col gap-[18px] overflow-hidden p-4 lg:flex-row lg:p-[22px]">
      {/* Left — master list */}
      <div className="flex w-full shrink-0 flex-col max-lg:max-h-[46vh] lg:w-[326px]">
        <div className="mb-3.5 flex items-center">
          <h1 className="flex-1 text-base font-bold tracking-tight text-ink">
            운영자{" "}
            {operators && (
              <span className="bl-tnum font-semibold text-ink-3">
                {operators.length}
              </span>
            )}
          </h1>
        </div>

        <div className="mb-2.5 flex h-[38px] items-center gap-2 rounded-[7px] border border-line-strong bg-surface-1 px-2.5">
          <Icon name="search" size={16} className="text-ink-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름·이메일 검색"
            aria-label="운영자 이름·이메일 검색"
            className="flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-3"
          />
        </div>

        {/* status filter */}
        <div
          role="tablist"
          aria-label="운영자 상태 필터"
          className="mb-3 flex gap-1 rounded-[8px] border border-line bg-surface-1 p-1"
        >
          {FILTERS.map((f) => {
            const active = filter === f.value;
            const count =
              f.value === "all"
                ? counts.all
                : f.value === "pending"
                  ? counts.pending
                  : counts.approved;
            return (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "flex-1 rounded-[6px] px-2 py-1.5 text-[12.5px] font-semibold transition-colors",
                  active
                    ? "bg-accent-weak text-accent-text"
                    : "text-ink-3 hover:bg-surface-2",
                )}
              >
                {f.label}
                {operators && (
                  <span className="bl-tnum ml-1 text-ink-3">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-auto">
          {operators === null ? (
            <div className="flex justify-center py-10">
              <Spinner size={22} />
            </div>
          ) : listError ? (
            <EmptyState
              tone="danger"
              title="불러오기 실패"
              description={listError}
              action={
                <Button size="sm" variant="secondary" icon="refresh" onClick={() => reload(true)}>
                  다시 시도
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="shieldCheck"
              title={query || filter !== "all" ? "결과가 없어요" : "아직 운영자가 없어요"}
              description={
                query
                  ? `‘${query}’와 일치하는 운영자가 없어요.`
                  : filter === "pending"
                    ? "승인 대기 중인 운영자가 없어요."
                    : filter === "approved"
                      ? "승인된 운영자가 없어요."
                      : "운영자 가입 신청이 들어오면 여기에 표시돼요."
              }
            />
          ) : (
            filtered.map((o) => (
              <OperatorListItem
                key={o.id}
                operator={o}
                selected={o.id === selectedId}
                onClick={() => setSelectedId(o.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right — detail */}
      {selected ? (
        <OperatorDetail
          operator={selected}
          currentAdmin={currentAdmin}
          onEdit={() => setEditing(true)}
          onApprove={() => handleApprove(selected)}
          onRevokeApproval={() => handleRevoke(selected)}
          onAssignRole={(role) => handleAssignRole(selected, role)}
          onRemove={() => handleRemove(selected)}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-[10px] border border-line bg-surface-1">
          <EmptyState
            icon="shieldCheck"
            title="운영자를 선택하세요"
            description="왼쪽 목록에서 운영자를 선택하면 상세 정보와 관리 동작이 보여요."
          />
        </div>
      )}

      {/* Edit modal */}
      {selected && editing && (
        <OperatorEditModal
          operator={selected}
          onClose={() => setEditing(false)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}
