"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { avatarIdx } from "@/lib/avatar";
import { formatRelative } from "@/lib/format";
import {
  commentsControllerFindAll,
  commentsControllerCreate,
  commentsControllerUpdate,
  commentsControllerRemove,
} from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { roleAtLeast } from "@/lib/api/types";
import type { components, CurrentUser } from "@/lib/api/types";
import { CommentComposer } from "./comment-composer";

/**
 * A single comment with its replies. Replies are loaded lazily (the backend
 * exposes them via GET /comments?postId=&parentId=). Only direct replies are
 * supported one level deep, matching the design reference's two-level thread.
 */
export function CommentItem({
  comment,
  postId,
  currentUser,
  nameOf,
  isReply = false,
  onChanged,
}: {
  comment: components["schemas"]["CommentEntity"];
  postId: string;
  currentUser: CurrentUser | null;
  nameOf: (id: string) => string;
  isReply?: boolean;
  onChanged: () => void;
}) {
  const toast = useToast();
  const authorName = nameOf(comment.authorId);
  const isAuthor = currentUser?.id === comment.authorId;
  // The board OWNER/MANAGER can also delete; we can't know board role here, so we
  // approximate with the tenant role as a UX hint (server enforces the real rule).
  const canManage = isAuthor || roleAtLeast(currentUser?.role, "MANAGER");

  const [replyOpen, setReplyOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [replies, setReplies] = useState<components["schemas"]["CommentEntity"][] | null>(null);
  const [repliesOpen, setRepliesOpen] = useState(false);

  async function loadReplies() {
    try {
      setReplies((await commentsControllerFindAll({ client, query: { postId, parentId: comment.id } })).data!);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "답글을 불러오지 못했어요.");
      setReplies([]);
    }
  }

  function toggleReplies() {
    const next = !repliesOpen;
    setRepliesOpen(next);
    if (next && replies === null) void loadReplies();
  }

  async function submitReply(content: string) {
    await commentsControllerCreate({ client, body: { postId, parentId: comment.id, content } });
    toast.success("답글을 등록했어요.");
    setReplyOpen(false);
    setRepliesOpen(true);
    await loadReplies();
    onChanged();
  }

  async function saveEdit() {
    const content = editValue.trim();
    if (!content) return;
    try {
      await commentsControllerUpdate({ client, path: { id: comment.id }, body: { content } });
      toast.success("댓글을 수정했어요.");
      setEditing(false);
      onChanged();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "수정하지 못했어요.");
    }
  }

  async function doDelete() {
    await commentsControllerRemove({ client, path: { id: comment.id } });
    toast.success("댓글을 삭제했어요.");
    onChanged();
  }

  return (
    <div className={isReply ? "" : "border-b border-line py-4 last:border-b-0"}>
      <div className="flex gap-3">
        <Avatar name={authorName} idx={avatarIdx(comment.authorId)} size={isReply ? 26 : 32} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-ink">{authorName}</span>
            <span className="bl-tnum text-[12px] text-ink-3">
              {formatRelative(comment.createdAt)}
            </span>
          </div>

          {editing ? (
            <div className="mt-1.5 flex flex-col gap-2">
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                  취소
                </Button>
                <Button variant="primary" size="sm" onClick={saveEdit} disabled={!editValue.trim()}>
                  저장
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 whitespace-pre-wrap text-[13.5px] leading-relaxed text-ink-2">
              {comment.content}
            </p>
          )}

          {/* actions */}
          {!editing && (
            <div className="mt-1.5 flex items-center gap-3 text-[12px] text-ink-3">
              {!isReply && (
                <button
                  type="button"
                  onClick={() => setReplyOpen((o) => !o)}
                  className="flex items-center gap-1 hover:text-ink-2"
                >
                  <Icon name="reply" size={13} />
                  답글
                </button>
              )}
              {isAuthor && (
                <button
                  type="button"
                  onClick={() => {
                    setEditValue(comment.content);
                    setEditing(true);
                  }}
                  className="hover:text-ink-2"
                >
                  수정
                </button>
              )}
              {canManage && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="hover:text-danger"
                >
                  삭제
                </button>
              )}
              {!isReply && comment.replyCount > 0 && (
                <button
                  type="button"
                  onClick={toggleReplies}
                  className="flex items-center gap-1 font-medium text-accent-text hover:underline"
                >
                  <Icon name={repliesOpen ? "chevronDown" : "chevronRight"} size={13} />
                  답글 {comment.replyCount}개
                </button>
              )}
            </div>
          )}

          {/* reply composer */}
          {replyOpen && (
            <div className="mt-3">
              <CommentComposer
                placeholder="답글을 입력하세요"
                submitLabel="답글 등록"
                autoFocus
                onSubmit={submitReply}
                onCancel={() => setReplyOpen(false)}
              />
            </div>
          )}

          {/* replies */}
          {!isReply && repliesOpen && (
            <div className="mt-3 flex flex-col gap-3 border-l border-line pl-3.5">
              {replies === null ? (
                <span className="text-[12px] text-ink-3">답글을 불러오는 중…</span>
              ) : replies.length === 0 ? (
                <span className="text-[12px] text-ink-3">답글이 없어요.</span>
              ) : (
                replies.map((r) => (
                  <CommentItem
                    key={r.id}
                    comment={r}
                    postId={postId}
                    currentUser={currentUser}
                    nameOf={nameOf}
                    isReply
                    onChanged={() => {
                      void loadReplies();
                      onChanged();
                    }}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={doDelete}
        title="댓글을 삭제할까요?"
        description="삭제한 댓글은 되돌릴 수 없어요."
        confirmLabel="삭제"
      />
    </div>
  );
}
