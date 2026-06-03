"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { useToast } from "@/components/ui/toast";
import { usersControllerUpdate } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/types";
import { SectionCard } from "./section-card";

/** 프로필 수정 (T-AC-03) — update my username/email. */
export function EditProfileForm({
  initialUsername,
  initialEmail,
  onUpdated,
}: {
  initialUsername: string;
  initialEmail: string;
  /** Called with the fresh profile so the parent can reflect new values. */
  onUpdated: (profile: components["schemas"]["UserEntity"]) => void;
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

    const nextUsername = username.trim();
    if (!nextUsername) {
      setError("아이디를 입력해 주세요.");
      return;
    }

    const changed: { username?: string; email?: string } = {};
    if (nextUsername !== initialUsername.trim()) changed.username = nextUsername;
    if (email.trim() !== initialEmail.trim()) changed.email = email.trim();
    if (Object.keys(changed).length === 0) return;

    setSubmitting(true);
    try {
      const updated = (await usersControllerUpdate({ client, body: changed })).data!;
      onUpdated(updated);
      setUsername(updated.username);
      setEmail(updated.email ?? "");
      toast.success("프로필을 저장했어요.");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "저장 중 문제가 발생했어요.",
      );
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
            placeholder="아이디"
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
          <Button
            type="submit"
            variant="primary"
            disabled={submitting || !dirty}
          >
            {submitting ? "저장 중…" : "저장"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
