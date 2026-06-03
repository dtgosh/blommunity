"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, PasswordInput } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { useToast } from "@/components/ui/toast";
import { authControllerChangePassword } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { SectionCard } from "./section-card";

/** 비밀번호 변경 (T-AC-04). */
export function ChangePasswordForm() {
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError("새 비밀번호는 8자 이상이어야 해요.");
      return;
    }
    if (newPassword !== confirm) {
      setError("새 비밀번호가 일치하지 않아요.");
      return;
    }

    setSubmitting(true);
    try {
      await authControllerChangePassword({ client, body: { currentPassword, newPassword } });
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      toast.success("비밀번호를 변경했어요.");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 401
            ? "현재 비밀번호가 올바르지 않아요."
            : err.message,
        );
      } else {
        setError("변경 중 문제가 발생했어요.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionCard
      title="비밀번호 변경"
      description="현재 비밀번호를 확인한 뒤 새 비밀번호로 바꿔요."
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
        <Field label="현재 비밀번호" htmlFor="current-password">
          <PasswordInput
            id="current-password"
            autoComplete="current-password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </Field>
        <Field label="새 비밀번호" htmlFor="new-password" hint="8자 이상">
          <PasswordInput
            id="new-password"
            autoComplete="new-password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            required
          />
        </Field>
        <Field label="새 비밀번호 확인" htmlFor="confirm-password">
          <PasswordInput
            id="confirm-password"
            autoComplete="new-password"
            placeholder="새 비밀번호 확인"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </Field>

        <FormError message={error} />

        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "변경 중…" : "비밀번호 변경"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
