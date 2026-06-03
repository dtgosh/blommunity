"use client";

// 게시판 관리 — T-BD-01~12 (✅). 목록/생성/상세/수정/삭제 + 초대.
// 멤버목록(T-BD-13)·역할변경(14)·탈퇴(15)·카테고리(16)는 백엔드 미구현(📅).
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/auth/auth-provider";
import {
  boardsControllerFindAll,
  boardsControllerFindOne,
  boardsControllerCreate,
  boardsControllerUpdate,
  boardsControllerRemove,
  spacesControllerFindAll,
} from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/types";
import { BoardListItem } from "./board-list-item";
import { BoardPanel } from "./board-detail";
import { BoardFormModal, type BoardFormValues } from "./board-form-modal";

export function BoardsScreen() {
  const toast = useToast();
  const { user } = useAuth();

  const [boards, setBoards] = useState<components["schemas"]["BoardEntity"][] | null>(null);
  const [spaces, setSpaces] = useState<components["schemas"]["SpaceEntity"][]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [detail, setDetail] = useState<components["schemas"]["BoardEntity"] | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const spaceName = useMemo(() => {
    const map = new Map<string, string>();
    spaces.forEach((s) => map.set(s.id, s.name));
    return map;
  }, [spaces]);

  const loadList = useCallback(async (selectFirst = false) => {
    setListError(null);
    try {
      // Spaces are needed for the create form + showing each board's space name.
      const [b, s] = await Promise.all([
        boardsControllerFindAll({ client }).then(r => r.data!),
        spacesControllerFindAll({ client }).then(r => r.data!),
      ]);
      setBoards(b);
      setSpaces(s);
      if (selectFirst && b.length > 0) {
        setSelectedId((cur) => cur ?? b[0].id);
      }
    } catch (err) {
      setBoards([]);
      setListError(
        err instanceof ApiError ? err.message : "게시판 목록을 불러오지 못했어요.",
      );
    }
  }, []);

  useEffect(() => {
    void loadList(true);
  }, [loadList]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    setDetailError(null);
    boardsControllerFindOne({ client, path: { id: selectedId } })
      .then((r) => {
        if (!cancelled) setDetail(r.data!);
      })
      .catch((err) => {
        if (cancelled) return;
        setDetail(null);
        setDetailError(
          err instanceof ApiError ? err.message : "게시판을 불러오지 못했어요.",
        );
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const refreshDetail = useCallback(async () => {
    if (!selectedId) return;
    try {
      setDetail((await boardsControllerFindOne({ client, path: { id: selectedId } })).data!);
    } catch {
      /* keep last good detail */
    }
  }, [selectedId]);

  async function handleCreate(values: BoardFormValues) {
    const created = (await boardsControllerCreate({ client, body: { spaceId: values.spaceId, name: values.name, description: values.description || undefined, visibility: values.visibility } })).data!;
    toast.success("게시판을 만들었어요.");
    await loadList();
    setSelectedId(created.id);
  }

  async function handleEdit(values: BoardFormValues) {
    if (!detail) return;
    await boardsControllerUpdate({ client, path: { id: detail.id }, body: { name: values.name, description: values.description || undefined, visibility: values.visibility } });
    toast.success("게시판을 수정했어요.");
    await Promise.all([loadList(), refreshDetail()]);
  }

  async function handleDelete() {
    if (!detail) return;
    await boardsControllerRemove({ client, path: { id: detail.id } });
    toast.success("게시판을 삭제했어요.");
    const deletedId = detail.id;
    setDetail(null);
    setSelectedId(null);
    setBoards((prev) => prev?.filter((b) => b.id !== deletedId) ?? null);
    await loadList(true);
  }

  const list = (boards ?? []).filter((b) =>
    b.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="flex h-full flex-col gap-[18px] overflow-hidden p-4 lg:flex-row lg:p-[22px]">
      {/* Left — master list */}
      <div className="flex w-full shrink-0 flex-col max-lg:max-h-[42vh] lg:w-[326px]">
        <div className="mb-3.5 flex items-center">
          <h1 className="flex-1 text-base font-bold tracking-tight text-ink">
            게시판{" "}
            {boards && (
              <span className="bl-tnum font-semibold text-ink-3">
                {boards.length}
              </span>
            )}
          </h1>
        </div>

        <div className="mb-2.5 flex h-[38px] items-center gap-2 rounded-[7px] border border-line-strong bg-surface-1 px-2.5">
          <Icon name="search" size={16} className="text-ink-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="게시판 검색"
            aria-label="게시판 검색"
            className="flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-3"
          />
        </div>

        <Button
          variant="primary"
          full
          icon="plus"
          className="mb-3.5"
          onClick={() => setCreating(true)}
        >
          새 게시판 만들기
        </Button>

        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-auto">
          {boards === null ? (
            <div className="flex justify-center py-10">
              <Spinner size={22} />
            </div>
          ) : listError ? (
            <EmptyState
              tone="danger"
              title="불러오기 실패"
              description={listError}
              action={
                <Button size="sm" variant="secondary" icon="refresh" onClick={() => loadList(true)}>
                  다시 시도
                </Button>
              }
            />
          ) : list.length === 0 ? (
            <EmptyState
              icon="boards"
              title={query ? "검색 결과가 없어요" : "아직 게시판이 없어요"}
              description={
                query
                  ? `‘${query}’와 일치하는 게시판이 없어요.`
                  : "공간을 고른 뒤 첫 게시판을 만들어 보세요."
              }
            />
          ) : (
            list.map((b) => (
              <BoardListItem
                key={b.id}
                board={b}
                spaceName={spaceName.get(b.spaceId)}
                selected={b.id === selectedId}
                onClick={() => setSelectedId(b.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right — detail */}
      {detailLoading ? (
        <div className="flex flex-1 items-center justify-center rounded-[10px] border border-line bg-surface-1">
          <Spinner size={24} />
        </div>
      ) : detail ? (
        <BoardPanel
          board={detail}
          spaceName={spaceName.get(detail.spaceId)}
          currentUser={user}
          onEdit={() => setEditing(true)}
          onDelete={() => setDeleting(true)}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-[10px] border border-line bg-surface-1">
          <EmptyState
            tone={detailError ? "danger" : "neutral"}
            icon="boards"
            title={detailError ? "불러오기 실패" : "게시판을 선택하세요"}
            description={
              detailError ?? "왼쪽 목록에서 게시판을 선택하면 상세 정보가 보여요."
            }
          />
        </div>
      )}

      {/* Modals */}
      <BoardFormModal
        open={creating}
        onClose={() => setCreating(false)}
        onSubmit={handleCreate}
        spaces={spaces}
      />
      {detail && (
        <BoardFormModal
          open={editing}
          onClose={() => setEditing(false)}
          onSubmit={handleEdit}
          spaces={spaces}
          initial={detail}
        />
      )}
      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={handleDelete}
        title="게시판을 삭제할까요?"
        description={detail ? `‘${detail.name}’ 게시판을 삭제합니다.` : ""}
        confirmLabel="삭제"
      />
    </div>
  );
}
