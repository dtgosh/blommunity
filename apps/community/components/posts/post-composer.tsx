"use client";

// 글쓰기 / 수정 — U-PT-01 / U-PT-04 (✅). 첨부·태그(U-PT-06·08)는 백엔드 미구현(📅).
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { FormError } from "@/components/ui/form-error";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { useToast } from "@/components/ui/toast";
import {
  boardsControllerFindAll,
  postsControllerFindOne,
  postsControllerCreate,
  postsControllerUpdate,
} from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/types";

export function PostComposer() {
  const router = useRouter();
  const toast = useToast();
  const params = useSearchParams();
  const editPostId = params.get("postId");
  const initialBoardId = params.get("boardId") ?? "";

  const [boards, setBoards] = useState<components["schemas"]["BoardEntity"][] | null>(null);
  const [boardId, setBoardId] = useState(initialBoardId);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load boards for the selector + (when editing) the post being edited.
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      boardsControllerFindAll({ client }).then(r => r.data!),
      editPostId ? postsControllerFindOne({ client, path: { id: editPostId } }).then(r => r.data!) : Promise.resolve(null),
    ])
      .then(([b, post]) => {
        if (cancelled) return;
        setBoards(b);
        if (post) {
          setBoardId(post.boardId);
          setTitle(post.title);
          setContent(post.content);
        } else if (!initialBoardId && b.length > 0) {
          setBoardId(b[0].id);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setBoards([]);
        setLoadError(
          err instanceof ApiError ? err.message : "불러오지 못했어요.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [editPostId, initialBoardId]);

  const boardOptions = useMemo(
    () => (boards ?? []).map((b) => ({ value: b.id, label: b.name })),
    [boards],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!boardId) {
      setError("게시판을 선택하세요.");
      return;
    }
    if (!title.trim() || !content.trim()) {
      setError("제목과 본문을 입력하세요.");
      return;
    }
    setSubmitting(true);
    try {
      if (editPostId) {
        await postsControllerUpdate({ client, path: { id: editPostId }, body: { title: title.trim(), content: content.trim() } });
        toast.success("글을 수정했어요.");
        router.replace(`/posts/${editPostId}`);
      } else {
        const created = (await postsControllerCreate({ client, body: { boardId, title: title.trim(), content: content.trim() } })).data!;
        toast.success("글을 등록했어요.");
        router.replace(`/posts/${created.id}`);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장에 실패했어요.");
      setSubmitting(false);
    }
  }

  if (boards === null) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={24} />
      </div>
    );
  }

  if (loadError) {
    return (
      <EmptyState tone="danger" title="불러오기 실패" description={loadError} />
    );
  }

  if (boards.length === 0) {
    return (
      <EmptyState
        icon="boards"
        title="글을 쓸 게시판이 없어요"
        description="글을 작성하려면 먼저 게시판에 참여해야 해요."
      />
    );
  }

  return (
    <div className="mx-auto max-w-[720px]">
      <h1 className="mb-5 text-xl font-bold tracking-tight text-ink">
        {editPostId ? "글 수정" : "글쓰기"}
      </h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <Field label="게시판" htmlFor="board">
          <Select
            id="board"
            value={boardId}
            onChange={setBoardId}
            options={boardOptions}
            placeholder="게시판 선택"
            disabled={!!editPostId}
          />
        </Field>

        <Field label="제목" htmlFor="title">
          <Input
            id="title"
            inputSize="lg"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Field>

        <Field label="본문" htmlFor="content">
          <Textarea
            id="content"
            rows={14}
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Field>

        {/* 첨부·태그 준비 중 */}
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-line px-3.5 py-2.5 text-[12.5px] text-ink-3">
          <Icon name="image" size={15} />
          이미지 첨부·태그는 준비 중인 기능이에요. (U-PT-06 · U-PT-08)
        </div>

        <FormError message={error} />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "저장 중…" : editPostId ? "수정 완료" : "등록"}
          </Button>
        </div>
      </form>
    </div>
  );
}
