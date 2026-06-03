"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Field, PasswordInput } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { ApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/types";

const MIN_LENGTH = 8;

/** T-UM-05 — force-set a member's password (MANAGER+, not self/OWNER). */
export function ResetPasswordModal({
  open,
  member,
  onClose,
  onSubmit,
}: {
  open: boolean;
  member: components["schemas"]["UserEntity"] | null;
  onClose: () => void;
  onSubmit: (newPassword: string) => Promise<void>;
}) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function close() {
    if (busy) return;
    setPassword("");
    setError(null);
    onClose();
  }

  async function submit() {
    if (password.length < MIN_LENGTH) {
      setError(`비밀번호는 ${MIN_LENGTH}자 이상이어야 해요.`);
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await onSubmit(password);
      setPassword("");
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "비밀번호를 재설정하지 못했어요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="비밀번호 리셋"
      description={member ? `‘${member.username}’ 회원의 비밀번호를 새로 설정합니다.` : ""}
      width={420}
      footer={
        <>
          <Button variant="ghost" type="button" onClick={close} disabled={busy}>
            취소
          </Button>
          <Button variant="primary" type="button" onClick={submit} disabled={busy}>
            {busy ? "처리 중…" : "비밀번호 재설정"}
          </Button>
        </>
      }
    >
      <FormError message={error} />
      <Field
        label="새 비밀번호"
        htmlFor="reset-password"
        hint={`${MIN_LENGTH}자 이상 입력하세요.`}
      >
        <PasswordInput
          id="reset-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="새 비밀번호"
          autoComplete="new-password"
          onKeyDown={(e) => {
            if (e.key === "Enter") void submit();
          }}
        />
      </Field>
    </Modal>
  );
}
