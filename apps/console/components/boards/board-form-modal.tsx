"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { VisibilitySelect } from "@/components/ui/visibility-select";
import { FormError } from "@/components/ui/form-error";
import { ApiError } from "@/lib/api/errors";
import type { components, Visibility } from "@/lib/api/types";

export interface BoardFormValues {
  spaceId: string;
  name: string;
  description: string;
  visibility: Visibility;
}

/**
 * Create/edit form for a board (T-BD-01 / T-BD-04). On create the user must pick
 * a parent space; on edit the space is fixed (the API has no move-board op).
 */
export function BoardFormModal({
  open,
  onClose,
  onSubmit,
  spaces,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: BoardFormValues) => Promise<void>;
  spaces: components["schemas"]["SpaceEntity"][];
  initial?: components["schemas"]["BoardEntity"];
}) {
  const editing = Boolean(initial);
  const [spaceId, setSpaceId] = useState(
    initial?.spaceId ?? spaces[0]?.id ?? "",
  );
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [visibility, setVisibility] = useState<Visibility>(
    initial?.visibility ?? "PUBLIC",
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!editing && !spaceId) {
      setError("게시판을 만들 공간을 선택해 주세요.");
      return;
    }
    if (!name.trim()) {
      setError("게시판 이름을 입력해 주세요.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        spaceId,
        name: name.trim(),
        description: description.trim(),
        visibility,
      });
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장하지 못했어요.");
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "게시판 수정" : "새 게시판 만들기"}
      description={
        editing
          ? "게시판의 이름·설명·공개 범위를 수정합니다."
          : "공간 안에 새 게시판을 만듭니다. 당신이 OWNER가 됩니다."
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} type="button">
            취소
          </Button>
          <Button variant="primary" onClick={submit} disabled={saving} type="submit">
            {saving ? "저장 중…" : editing ? "저장" : "만들기"}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-[18px]">
        {!editing && (
          <Field
            label="공간"
            htmlFor="board-space"
            hint={
              spaces.length === 0
                ? "먼저 공간을 만들어야 게시판을 추가할 수 있어요."
                : undefined
            }
          >
            <Select
              id="board-space"
              value={spaceId}
              onChange={setSpaceId}
              placeholder="공간 선택"
              disabled={spaces.length === 0}
              options={spaces.map((s) => ({ value: s.id, label: s.name }))}
            />
          </Field>
        )}
        <Field label="게시판 이름" htmlFor="board-name">
          <Input
            id="board-name"
            autoFocus
            maxLength={50}
            placeholder="예: 자유게시판"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="설명" htmlFor="board-desc" hint="최대 200자 (선택)">
          <Textarea
            id="board-desc"
            maxLength={200}
            rows={3}
            placeholder="이 게시판을 한 줄로 소개해 주세요."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Field label="공개 범위" htmlFor="board-vis">
          <VisibilitySelect value={visibility} onChange={setVisibility} />
        </Field>
        <FormError message={error} />
      </form>
    </Modal>
  );
}
