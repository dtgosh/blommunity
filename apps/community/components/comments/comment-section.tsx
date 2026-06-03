"use client";

// 댓글 섹션 — U-CM-01~06 (✅). 최상위 댓글 작성/목록 + 대댓글(지연 로드)·수정·삭제.
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { commentsControllerFindAll, commentsControllerCreate } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { useUserNames } from "@/lib/use-user-names";
import type { components, CurrentUser } from "@/lib/api/types";
import { CommentComposer } from "./comment-composer";
import { CommentItem } from "./comment-item";

export function CommentSection({
  postId,
  currentUser,
  onCountChange,
}: {
  postId: string;
  currentUser: CurrentUser | null;
  /** Called after a top-level change so the parent can refresh the post counter. */
  onCountChange?: () => void;
}) {
  const { nameOf } = useUserNames();
  const [comments, setComments] = useState<components["schemas"]["CommentEntity"][] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setComments((await commentsControllerFindAll({ client, query: { postId } })).data!);
      setError(null);
    } catch (err) {
      setComments([]);
      setError(err instanceof ApiError ? err.message : "댓글을 불러오지 못했어요.");
    }
  }

  // Reload whenever the post changes. `load` closes over postId only; recreating
  // it each render must not retrigger this effect, so it's intentionally omitted.
  useEffect(() => {
    void load();
  }, [postId]);

  async function submitTopLevel(content: string) {
    await commentsControllerCreate({ client, body: { postId, content } });
    await load();
    onCountChange?.();
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-[15px] font-bold text-ink">
        댓글{" "}
        {comments && (
          <span className="bl-tnum font-semibold text-ink-3">{comments.length}</span>
        )}
      </h2>

      <CommentComposer onSubmit={submitTopLevel} />

      {comments === null ? (
        <div className="flex justify-center py-8">
          <Spinner size={20} />
        </div>
      ) : error ? (
        <p className="text-[13px] text-danger">{error}</p>
      ) : comments.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-ink-3">
          첫 댓글을 남겨 보세요.
        </p>
      ) : (
        <div className="flex flex-col">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              postId={postId}
              currentUser={currentUser}
              nameOf={nameOf}
              onChanged={() => {
                void load();
                onCountChange?.();
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
