"use client";

// 공간 관리 — T-SP-01~12 (✅). 목록/생성/상세/수정/삭제 + 멤버(상세 기반)·초대.
// T-SP-13(멤버목록 전용 API)·14(역할변경)·15(탈퇴)는 백엔드 미구현(📅).
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/auth/auth-provider";
import {
  spacesControllerFindAll,
  spacesControllerFindOne,
  spacesControllerCreate,
  spacesControllerUpdate,
  spacesControllerRemove,
} from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/types";
import { SpaceListItem } from "./space-list-item";
import { SpacePanel } from "./space-detail";
import { SpaceFormModal, type SpaceFormValues } from "./space-form-modal";

export function SpacesScreen() {
  const toast = useToast();
  const { user } = useAuth();

  const [spaces, setSpaces] = useState<components["schemas"]["SpaceEntity"][] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [detail, setDetail] = useState<components["schemas"]["SpaceEntity"] | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadList = useCallback(async (selectFirst = false) => {
    setListError(null);
    try {
      const data = (await spacesControllerFindAll({ client })).data!;
      setSpaces(data);
      if (selectFirst && data.length > 0) {
        setSelectedId((cur) => cur ?? data[0].id);
      }
    } catch (err) {
      setSpaces([]);
      setListError(
        err instanceof ApiError ? err.message : "공간 목록을 불러오지 못했어요.",
      );
    }
  }, []);

  useEffect(() => {
    void loadList(true);
  }, [loadList]);

  // Load detail when selection changes.
  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setDetailLoading(true);
    setDetailError(null);
    spacesControllerFindOne({ client, path: { id: selectedId } })
      .then((r) => {
        if (!cancelled) setDetail(r.data!);
      })
      .catch((err) => {
        if (cancelled) return;
        setDetail(null);
        setDetailError(
          err instanceof ApiError ? err.message : "공간을 불러오지 못했어요.",
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
      setDetail((await spacesControllerFindOne({ client, path: { id: selectedId } })).data!);
    } catch {
      /* keep last good detail */
    }
  }, [selectedId]);

  async function handleCreate(values: SpaceFormValues) {
    const created = (await spacesControllerCreate({ client, body: { name: values.name, description: values.description || undefined, visibility: values.visibility } })).data!;
    toast.success("공간을 만들었어요.");
    await loadList();
    setSelectedId(created.id);
  }

  async function handleEdit(values: SpaceFormValues) {
    if (!detail) return;
    await spacesControllerUpdate({ client, path: { id: detail.id }, body: { name: values.name, description: values.description || undefined, visibility: values.visibility } });
    toast.success("공간을 수정했어요.");
    await Promise.all([loadList(), refreshDetail()]);
  }

  async function handleDelete() {
    if (!detail) return;
    await spacesControllerRemove({ client, path: { id: detail.id } });
    toast.success("공간을 삭제했어요.");
    const deletedId = detail.id;
    setDetail(null);
    setSelectedId(null);
    setSpaces((prev) => prev?.filter((s) => s.id !== deletedId) ?? null);
    await loadList(true);
  }

  const list = (spaces ?? []).filter((s) =>
    s.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="flex h-full flex-col gap-[18px] overflow-hidden p-4 lg:flex-row lg:p-[22px]">
      {/* Left — master list */}
      <div className="flex w-full shrink-0 flex-col max-lg:max-h-[42vh] lg:w-[326px]">
        <div className="mb-3.5 flex items-center">
          <h1 className="flex-1 text-base font-bold tracking-tight text-ink">
            공간{" "}
            {spaces && (
              <span className="bl-tnum font-semibold text-ink-3">
                {spaces.length}
              </span>
            )}
          </h1>
        </div>

        <div className="mb-2.5 flex h-[38px] items-center gap-2 rounded-[7px] border border-line-strong bg-surface-1 px-2.5">
          <Icon name="search" size={16} className="text-ink-3" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="공간 검색"
            aria-label="공간 검색"
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
          새 공간 만들기
        </Button>

        <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-auto">
          {spaces === null ? (
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
              icon="spaces"
              title={query ? "검색 결과가 없어요" : "아직 공간이 없어요"}
              description={
                query ? `‘${query}’와 일치하는 공간이 없어요.` : "첫 공간을 만들어 시작해 보세요."
              }
            />
          ) : (
            list.map((s) => (
              <SpaceListItem
                key={s.id}
                space={s}
                selected={s.id === selectedId}
                onClick={() => setSelectedId(s.id)}
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
        <SpacePanel
          space={detail}
          currentUser={user}
          onEdit={() => setEditing(true)}
          onDelete={() => setDeleting(true)}
        />
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-[10px] border border-line bg-surface-1">
          <EmptyState
            tone={detailError ? "danger" : "neutral"}
            icon="spaces"
            title={detailError ? "불러오기 실패" : "공간을 선택하세요"}
            description={
              detailError ?? "왼쪽 목록에서 공간을 선택하면 상세 정보가 보여요."
            }
          />
        </div>
      )}

      {/* Modals */}
      <SpaceFormModal
        open={creating}
        onClose={() => setCreating(false)}
        onSubmit={handleCreate}
      />
      {detail && (
        <SpaceFormModal
          open={editing}
          onClose={() => setEditing(false)}
          onSubmit={handleEdit}
          initial={detail}
        />
      )}
      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={handleDelete}
        title="공간을 삭제할까요?"
        description={detail ? `‘${detail.name}’ 공간을 삭제합니다.` : ""}
        confirmLabel="삭제"
      />
    </div>
  );
}
