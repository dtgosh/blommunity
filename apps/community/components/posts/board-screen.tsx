"use client";

// 게시판 상세 (글 목록) — U-PT-02 / T-BD-03 (✅). 게시판 정보 + 그 게시판의 글.
// GET /posts 는 boardId 필터가 없어 접근 가능한 모든 글을 받아 클라이언트에서
// boardId로 거릅니다. 작성자명은 GET /users로 authorId→username 해석합니다.
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { VisibilityBadge } from "@/components/ui/role-badge";
import { boardsControllerFindOne, postsControllerFindAll } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { useUserNames } from "@/lib/use-user-names";
import type { components } from "@/lib/api/types";
import { PostRow } from "./post-row";

type Sort = "recent" | "comments";

export function BoardScreen({ boardId }: { boardId: string }) {
  const { nameOf } = useUserNames();
  const [board, setBoard] = useState<components["schemas"]["BoardEntity"] | null>(null);
  const [posts, setPosts] = useState<components["schemas"]["PostEntity"][] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("recent");

  function load() {
    setError(null);
    setBoard(null);
    setPosts(null);
    Promise.all([
      boardsControllerFindOne({ client, path: { id: boardId } }).then(r => r.data!),
      postsControllerFindAll({ client }).then(r => r.data!),
    ])
      .then(([b, allPosts]) => {
        setBoard(b);
        setPosts(allPosts.filter((p) => p.boardId === boardId));
      })
      .catch((err) => {
        setPosts([]);
        setError(
          err instanceof ApiError ? err.message : "게시판을 불러오지 못했어요.",
        );
      });
  }

  useEffect(load, [boardId]);

  const sorted = useMemo(() => {
    const list = [...(posts ?? [])];
    if (sort === "comments") {
      list.sort((a, b) => b.commentCount - a.commentCount);
    } else {
      list.sort((a, b) =>
        (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
      );
    }
    return list;
  }, [posts, sort]);

  if (posts === null) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={24} />
      </div>
    );
  }

  if (error || !board) {
    return (
      <EmptyState
        tone="danger"
        title="불러오기 실패"
        description={error ?? "게시판을 찾을 수 없어요."}
        action={
          <Button size="sm" variant="secondary" icon="refresh" onClick={load}>
            다시 시도
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/"
        className="flex w-fit items-center gap-1 text-[12.5px] text-ink-3 hover:text-ink-2"
      >
        <Icon name="arrowLeft" size={14} />
        둘러보기
      </Link>

      {/* board header */}
      <header className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[11px] bg-accent-weak text-accent-text">
          <Icon name="boards" size={22} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-xl font-bold tracking-tight text-ink">
              {board.name}
            </h1>
            <VisibilityBadge visibility={board.visibility} />
          </div>
          {board.description && (
            <p className="mt-1 text-[13px] leading-relaxed text-ink-3">
              {board.description}
            </p>
          )}
        </div>
        <Link href={`/write?boardId=${board.id}`} className="shrink-0">
          <Button variant="primary" size="sm" icon="penLine">
            글쓰기
          </Button>
        </Link>
      </header>

      {/* sort tabs */}
      <div className="flex items-center justify-between border-b border-line pb-2">
        <div className="flex gap-1">
          {(
            [
              { value: "recent", label: "최신순" },
              { value: "comments", label: "댓글순" },
            ] as const
          ).map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setSort(t.value)}
              className={
                "rounded-[6px] px-3 py-1.5 text-[13px] font-semibold transition-colors " +
                (sort === t.value
                  ? "bg-accent-weak text-accent-text"
                  : "text-ink-3 hover:bg-surface-2")
              }
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="bl-tnum text-[12.5px] text-ink-3">{posts.length}개</span>
      </div>

      {/* post list */}
      {sorted.length === 0 ? (
        <EmptyState
          icon="penLine"
          title="아직 글이 없어요"
          description="이 게시판의 첫 글을 남겨 보세요."
          action={
            <Link href={`/write?boardId=${board.id}`}>
              <Button size="sm" variant="primary" icon="penLine">
                글쓰기
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col">
          {sorted.map((post) => (
            <PostRow key={post.id} post={post} authorName={nameOf(post.authorId)} />
          ))}
        </div>
      )}
    </div>
  );
}
