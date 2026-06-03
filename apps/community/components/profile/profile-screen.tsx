"use client";

// 내 프로필 — U-AC-03 (프로필 수정) · U-AC-04 (비밀번호 변경) · U-AC-05 (탈퇴). ✅
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, Input, PasswordInput } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { RoleBadge } from "@/components/ui/role-badge";
import { LoadingRegion } from "@/components/ui/spinner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/auth/auth-provider";
import { avatarIdx } from "@/lib/avatar";
import {
  usersControllerUpdate,
  usersControllerRemove,
  authControllerChangePassword,
} from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import { SectionCard } from "./section-card";

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Mirror editable fields locally so the header reflects edits immediately.
  const [override, setOverride] = useState<{ username?: string; email?: string | null }>({});

  if (!user) return <LoadingRegion label="프로필을 불러오는 중…" />;

  const username = override.username ?? user.username;
  const email = override.email !== undefined ? override.email : user.email;

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-6">
      {/* header */}
      <div className="flex items-center gap-4">
        <Avatar name={username} idx={avatarIdx(user.id)} size={60} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-xl font-bold text-ink">{username}</h1>
            <RoleBadge role={user.role} />
          </div>
          <p className="mt-0.5 truncate text-sm text-ink-3">
            {email || "이메일 미설정"}
          </p>
        </div>
      </div>

      <EditProfile
        initialUsername={username}
        initialEmail={email ?? ""}
        onUpdated={(u, e) => setOverride({ username: u, email: e })}
      />
      <ChangePassword />
      <DeleteAccount
        onDeleted={() => {
          logout();
          router.replace("/login");
        }}
      />
    </div>
  );
}

function EditProfile({
  initialUsername,
  initialEmail,
  onUpdated,
}: {
  initialUsername: string;
  initialEmail: string;
  onUpdated: (username: string, email: string | null) => void;
}) {
  const toast = useToast();
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const dirty =
    username.trim() !== initialUsername.trim() ||
    email.trim() !== initialEmail.trim();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const next = username.trim();
    if (!next) {
      setError("아이디를 입력해 주세요.");
      return;
    }
    const changed: { username?: string; email?: string } = {};
    if (next !== initialUsername.trim()) changed.username = next;
    if (email.trim() !== initialEmail.trim()) changed.email = email.trim();
    if (Object.keys(changed).length === 0) return;

    setSubmitting(true);
    try {
      const updated = (await usersControllerUpdate({ client, body: changed })).data!;
      onUpdated(updated.username, updated.email ?? null);
      setUsername(updated.username);
      setEmail(updated.email ?? "");
      toast.success("프로필을 저장했어요.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장 중 문제가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionCard title="프로필 수정" description="아이디와 이메일을 변경할 수 있어요.">
      <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
        <Field label="아이디" htmlFor="profile-username">
          <Input
            id="profile-username"
            inputSize="lg"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

function ChangePassword() {
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
        setError(err.status === 401 ? "현재 비밀번호가 올바르지 않아요." : err.message);
      } else {
        setError("변경 중 문제가 발생했어요.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionCard title="비밀번호 변경" description="현재 비밀번호를 확인한 뒤 새 비밀번호로 바꿔요.">
      <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
        <Field label="현재 비밀번호" htmlFor="current-password">
          <PasswordInput
            id="current-password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </Field>
        <Field label="새 비밀번호" htmlFor="new-password" hint="8자 이상">
          <PasswordInput
            id="new-password"
            autoComplete="new-password"
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

function DeleteAccount({ onDeleted }: { onDeleted: () => void }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);

  async function onConfirm() {
    await usersControllerRemove({ client });
    toast.success("계정을 탈퇴했어요.");
    onDeleted();
  }

  return (
    <>
      <SectionCard danger title="계정 탈퇴" description="탈퇴하면 계정이 비활성화돼요. 되돌릴 수 없어요.">
        <div className="flex justify-end">
          <Button variant="danger" icon="trash" type="button" onClick={() => setOpen(true)}>
            탈퇴
          </Button>
        </div>
      </SectionCard>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        title="정말 탈퇴할까요?"
        description="계정이 비활성화되고 다시 로그인할 수 없어요."
        confirmLabel="탈퇴"
      />
    </>
  );
}
