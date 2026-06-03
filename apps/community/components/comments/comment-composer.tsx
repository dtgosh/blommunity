"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { ApiError } from "@/lib/api/errors";

/** Inline composer for a new comment or reply. Calls `onSubmit(content)`. */
export function CommentComposer({
  placeholder = "댓글을 입력하세요",
  submitLabel = "댓글 등록",
  autoFocus,
  onSubmit,
  onCancel,
}: {
  placeholder?: string;
  submitLabel?: string;
  autoFocus?: boolean;
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
}) {
  const toast = useToast();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    const content = value.trim();
    if (!content) return;
    setBusy(true);
    try {
      await onSubmit(content);
      setValue("");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "등록하지 못했어요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={busy}>
            취소
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          icon="send"
          onClick={submit}
          disabled={busy || !value.trim()}
        >
          {busy ? "등록 중…" : submitLabel}
        </Button>
      </div>
    </div>
  );
}
