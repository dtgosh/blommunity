"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VisibilitySelect } from "@/components/ui/visibility-select";
import { FormError } from "@/components/ui/form-error";
import { ApiError } from "@/lib/api/errors";
import type { components, Visibility } from "@/lib/api/types";

export interface SpaceFormValues {
  name: string;
  description: string;
  visibility: Visibility;
}

/**
 * Create/edit form for a space (T-SP-01 / T-SP-04). `initial` switches it to
 * edit mode. `onSubmit` should perform the API call and resolve on success.
 */
export function SpaceFormModal({
  open,
  onClose,
  onSubmit,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: SpaceFormValues) => Promise<void>;
  initial?: components["schemas"]["SpaceEntity"];
}) {
  const editing = Boolean(initial);
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
    if (!name.trim()) {
      setError("공간 이름을 입력해 주세요.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
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
      title={editing ? "공간 수정" : "새 공간 만들기"}
      description={
        editing
          ? "공간의 이름·설명·공개 범위를 수정합니다."
          : "멤버들이 모일 새 공간을 만듭니다. 당신이 OWNER가 됩니다."
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} type="button">
            취소
          </Button>
          <Button
            variant="primary"
            onClick={submit}
            disabled={saving}
            type="submit"
          >
            {saving ? "저장 중…" : editing ? "저장" : "만들기"}
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-[18px]">
        <Field label="공간 이름" htmlFor="space-name">
          <Input
            id="space-name"
            autoFocus
            maxLength={50}
            placeholder="예: 북클럽"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field label="설명" htmlFor="space-desc" hint="최대 200자 (선택)">
          <Textarea
            id="space-desc"
            maxLength={200}
            rows={3}
            placeholder="이 공간을 한 줄로 소개해 주세요."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Field label="공개 범위" htmlFor="space-vis">
          <VisibilitySelect value={visibility} onChange={setVisibility} />
        </Field>
        <FormError message={error} />
      </form>
    </Modal>
  );
}
