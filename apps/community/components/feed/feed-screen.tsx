"use client";

// 메인 (공간·게시판 목록) — T-SP-02 / T-BD-02 (✅). 회원이 접근 가능한 공간과
// 그 안의 게시판을 둘러봅니다. 백엔드가 이미 접근 가능 항목만 반환합니다.
import { useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { VisibilityBadge } from "@/components/ui/role-badge";
import { spacesControllerFindAll, boardsControllerFindAll } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/types";
import { BoardCard } from "./board-card";

export function FeedScreen() {
  const [spaces, setSpaces] = useState<components["schemas"]["SpaceEntity"][] | null>(null);
  const [boards, setBoards] = useState<components["schemas"]["BoardEntity"][]>([]);
  const [error, setError] = useState<string | null>(null);

  function load() {
    setError(null);
    setSpaces(null);
    Promise.all([
      spacesControllerFindAll({ client }).then(r => r.data!),
      boardsControllerFindAll({ client }).then(r => r.data!),
    ])
      .then(([s, b]) => {
        setSpaces(s);
        setBoards(b);
      })
      .catch((err) => {
        setSpaces([]);
        setError(
          err instanceof ApiError ? err.message : "목록을 불러오지 못했어요.",
        );
      });
  }

  useEffect(load, []);

  const boardsBySpace = useMemo(() => {
    const map = new Map<string, components["schemas"]["BoardEntity"][]>();
    boards.forEach((b) => {
      const arr = map.get(b.spaceId) ?? [];
      arr.push(b);
      map.set(b.spaceId, arr);
    });
    return map;
  }, [boards]);

  if (spaces === null) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={24} />
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (spaces.length === 0) {
    return (
      <EmptyState
        icon="spaces"
        title="둘러볼 공간이 없어요"
        description="아직 참여할 수 있는 공간이 없어요. 초대를 받으면 받은 초대함에서 확인할 수 있어요."
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-xl font-bold tracking-tight text-ink">둘러보기</h1>
        <p className="mt-1 text-[13.5px] text-ink-3">
          참여 중이거나 공개된 공간과 게시판이에요.
        </p>
      </header>

      {spaces.map((space) => {
        const spaceBoards = boardsBySpace.get(space.id) ?? [];
        return (
          <section key={space.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-bold text-ink">{space.name}</h2>
              <VisibilityBadge visibility={space.visibility} />
              {space.description && (
                <span className="truncate text-[12.5px] text-ink-3">
                  {space.description}
                </span>
              )}
            </div>

            {spaceBoards.length === 0 ? (
              <div className="rounded-[11px] border border-dashed border-line px-4 py-6 text-center text-[13px] text-ink-3">
                이 공간에는 아직 볼 수 있는 게시판이 없어요.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {spaceBoards.map((board) => (
                  <BoardCard key={board.id} board={board} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
