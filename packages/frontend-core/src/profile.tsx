"use client";

import { useState } from "react";
import { Button } from "@blommunity/ui/button";
import { Field, Input, PasswordInput } from "@blommunity/ui/input";
import { FormError } from "@blommunity/ui/form-error";
import { SectionCard } from "@blommunity/ui/section-card";
import { useToast } from "@blommunity/ui/toast";
import { Avatar } from "@blommunity/ui/avatar";
import { RoleBadge } from "@blommunity/ui/role-badge";
import { avatarIdx } from "@blommunity/ui/avatar-util";
import { ApiError, type Role } from "@blommunity/types";

// ───────────────────────── ProfileHeader ─────────────────────────
// console(아이디 기반)·admin(이름 기반) 프로필 헤더 공통. displayName/email/role 과
// 아바타 색상 시드(avatarSeed)만 주입한다(console=username, admin=id).
export function ProfileHeader({
  displayName,
  email,
  role,
  avatarSeed,
}: {
  displayName: string;
  email: string | null;
  role: Role;
  avatarSeed: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <Avatar name={displayName} idx={avatarIdx(avatarSeed)} size={56} />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-lg font-semibold text-ink">{displayName}</h2>
          <RoleBadge role={role} />
        </div>
        {email ? (
          <p className="mt-0.5 truncate text-sm text-ink-2">{email}</p>
        ) : (
          <p className="mt-0.5 truncate text-sm text-ink-3">이메일 미설정</p>
        )}
      </div>
    </div>
  );
}

// ───────────────────────── ChangePasswordForm ─────────────────────────
// console/admin 동일. 호출하는 엔드포인트만 changePassword 로 주입한다.
export function ChangePasswordForm({
  changePassword,
}: {
  changePassword: (body: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<unknown>;
}) {
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
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      toast.success("비밀번호를 변경했어요.");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 401 ? "현재 비밀번호가 올바르지 않아요." : err.message,
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

// ───────────────────────── EditProfileForm ─────────────────────────
// console(아이디+이메일, 변경분만 PATCH)·admin(이름+이메일, 전체 PATCH) 공통 골격.
// 1차 필드(아이디/이름)·라벨·검증문구·이메일 필수 여부는 props 로, 실제 저장은
// onSave 로 주입한다. onSave 는 저장 후 화면에 반영할 정규화 값을 반환한다.
export function EditProfileForm({
  title,
  description,
  primaryLabel,
  primaryAutoComplete,
  primaryPlaceholder,
  primaryRequiredMessage,
  emailRequired = false,
  initialPrimary,
  initialEmail,
  onSave,
}: {
  title: string;
  description: string;
  primaryLabel: string;
  primaryAutoComplete: string;
  primaryPlaceholder: string;
  primaryRequiredMessage: string;
  emailRequired?: boolean;
  initialPrimary: string;
  initialEmail: string;
  onSave: (values: {
    primary: string;
    email: string;
  }) => Promise<{ primary: string; email: string }>;
}) {
  const toast = useToast();
  const [primary, setPrimary] = useState(initialPrimary);
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const dirty =
    primary.trim() !== initialPrimary.trim() ||
    email.trim() !== initialEmail.trim();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!primary.trim()) {
      setError(primaryRequiredMessage);
      return;
    }

    setSubmitting(true);
    try {
      const next = await onSave({ primary: primary.trim(), email: email.trim() });
      setPrimary(next.primary);
      setEmail(next.email);
      toast.success("프로필을 저장했어요.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장 중 문제가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionCard title={title} description={description}>
      <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
        <Field label={primaryLabel} htmlFor="profile-primary">
          <Input
            id="profile-primary"
            inputSize="lg"
            autoComplete={primaryAutoComplete}
            placeholder={primaryPlaceholder}
            value={primary}
            onChange={(e) => setPrimary(e.target.value)}
            required
          />
        </Field>
        <Field label="이메일" htmlFor="profile-email">
          <Input
            id="profile-email"
            type="email"
            inputSize="lg"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={emailRequired}
          />
        </Field>

        <FormError message={error} />

        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={submitting || !dirty}>
            {submitting ? "저장 중…" : "저장"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
