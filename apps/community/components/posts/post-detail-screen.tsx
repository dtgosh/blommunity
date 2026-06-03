"use client";

// 게시물 상세 — U-PT-03 + U-CM-01~06 (✅). 본문 + 작성자/메타 + 댓글 트리.
// 좋아요·저장·공유(U-CM-07/U-PT-07·13)는 백엔드 미구현(📅) → 비활성 + 준비 중.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/auth/auth-provider";
import { avatarIdx } from "@/lib/avatar";
import { formatRelative } from "@/lib/format";
import { postsControllerFindOne, postsControllerRemove } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { useUserNames } from "@/lib/use-user-names";
import { roleAtLeast } from "@/lib/api/types";
import type { components } from "@/lib/api/types";
import { CommentSection } from "@/components/comments/comment-section";

/** A disabled "준비 중" action chip (reactions/bookmark/share not in backend). */
function SoonAction({ icon, label }: { icon: IconName; label: string }) {
  return (
    <button
      type="button"
      disabled
      title="준비 중인 기능이에요"
      className="flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[12.5px] text-ink-3 opacity-70"
    >
      <Icon name={icon} size={15} />
      {label}
    </button>
  );
}

export function PostDetailScreen({ postId }: { postId: string }) {
  const router = useRouter();
  const toast = useToast();
  const { user } = useAuth();
  const { nameOf } = useUserNames();

  const [post, setPost] = useState<components["schemas"]["PostEntity"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function load() {
    setError(null);
    postsControllerFindOne({ client, path: { id: postId } })
      .then(r => setPost(r.data!))
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "게시물을 불러오지 못했어요."),
      );
  }

  useEffect(load, [postId]);

  async function doDelete() {
    if (!post) return;
    await postsControllerRemove({ client, path: { id: post.id } });
    toast.success("게시물을 삭제했어요.");
    router.replace(`/boards/${post.boardId}`);
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

  if (!post) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={24} />
      </div>
    );
  }

  const authorName = nameOf(post.authorId);
  const isAuthor = user?.id === post.authorId;
  const canManage = isAuthor || roleAtLeast(user?.role, "MANAGER");

  return (
    <article className="mx-auto flex max-w-[720px] flex-col gap-6">
      <Link
        href={`/boards/${post.boardId}`}
        className="flex w-fit items-center gap-1 text-[12.5px] text-ink-3 hover:text-ink-2"
      >
        <Icon name="arrowLeft" size={14} />
        게시판으로
      </Link>

      {/* header */}
      <header className="flex flex-col gap-3 border-b border-line pb-5">
        <h1 className="text-[22px] font-bold leading-snug tracking-tight text-ink">
          {post.title}
        </h1>
        <div className="flex items-center gap-2.5">
          <Avatar name={authorName} idx={avatarIdx(post.authorId)} size={34} />
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-ink">{authorName}</div>
            <div className="bl-tnum text-[12px] text-ink-3">
              {formatRelative(post.createdAt)}
            </div>
          </div>
          {isAuthor && (
            <div className="flex gap-1.5">
              <Link href={`/write?postId=${post.id}`}>
                <Button variant="secondary" size="sm" icon="edit">
                  수정
                </Button>
              </Link>
            </div>
          )}
          {canManage && (
            <Button
              variant="danger"
              size="sm"
              icon="trash"
              onClick={() => setConfirmDelete(true)}
            >
              삭제
            </Button>
          )}
        </div>
      </header>

      {/* body */}
      <div className="whitespace-pre-wrap text-[15px] leading-[1.8] text-ink-2">
        {post.content}
      </div>

      {/* reactions row — 준비 중 */}
      <div className="flex items-center gap-2 border-y border-line py-3">
        <SoonAction icon="heart" label="좋아요" />
        <SoonAction icon="bookmark" label="저장" />
        <SoonAction icon="share" label="공유" />
        <span className="ml-auto flex items-center gap-1.5 text-[12.5px] text-ink-3">
          <Icon name="comment" size={15} />
          <span className="bl-tnum">{post.commentCount}</span>
        </span>
      </div>

      {/* comments */}
      <CommentSection postId={post.id} currentUser={user} onCountChange={load} />

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={doDelete}
        title="게시물을 삭제할까요?"
        description={`‘${post.title}’ 게시물을 삭제합니다. 되돌릴 수 없어요.`}
        confirmLabel="삭제"
      />
    </article>
  );
}
