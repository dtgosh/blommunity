"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { SectionCard } from "./section-card";
import { useToast } from "@/components/ui/toast";
import { adminsControllerUpdate } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { components } from "@/lib/api/types";

/**
 * Edit my own operator profile. There is no PATCH /admins/me, but A-AM-03
 * (PATCH /admins/:id) accepts my own id, so we use it with the current admin id.
 */
export function EditProfileForm({
  adminId,
  initialName,
  initialEmail,
  onUpdated,
}: {
  adminId: string;
  initialName: string;
  initialEmail: string;
  onUpdated: (admin: components["schemas"]["AdminEntity"]) => void;
}) {
  const toast = useToast();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const dirty = name.trim() !== initialName.trim() || email.trim() !== initialEmail.trim();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const nextName = name.trim();
    if (!nextName) {
      setError("이름을 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const updated = (await adminsControllerUpdate({ client, path: { id: adminId }, body: { name: nextName, email: email.trim() } })).data!;
      onUpdated(updated);
      setName(updated.name);
      setEmail(updated.email ?? "");
      toast.success("프로필을 저장했어요.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장 중 문제가 발생했어요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SectionCard title="기본 정보" description="이름과 이메일을 변경할 수 있어요.">
      <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
        <Field label="이름" htmlFor="profile-name">
          <Input
            id="profile-name"
            inputSize="lg"
            autoComplete="name"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            required
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
