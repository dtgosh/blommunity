"use client";

// 프로필 수정 (T-AC-03) — 공통 폼(@blommunity/frontend-core/profile)에 콘솔 API만 바인딩.
// 콘솔은 변경된 필드만 PATCH /users (본인) 한다.
import { EditProfileForm as BaseEditProfileForm } from "@blommunity/frontend-core/profile";
import { usersControllerUpdate } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import type { components } from "@/lib/api/types";

export function EditProfileForm({
  initialUsername,
  initialEmail,
  onUpdated,
}: {
  initialUsername: string;
  initialEmail: string;
  onUpdated: (profile: components["schemas"]["UserEntity"]) => void;
}) {
  return (
    <BaseEditProfileForm
      title="프로필 수정"
      description="아이디와 이메일을 변경할 수 있어요."
      primaryLabel="아이디"
      primaryAutoComplete="username"
      primaryPlaceholder="아이디"
      primaryRequiredMessage="아이디를 입력해 주세요."
      initialPrimary={initialUsername}
      initialEmail={initialEmail}
      onSave={async ({ primary, email }) => {
        const changed: { username?: string; email?: string } = {};
        if (primary !== initialUsername.trim()) changed.username = primary;
        if (email !== initialEmail.trim()) changed.email = email;
        if (Object.keys(changed).length === 0) return { primary, email };
        const updated = (await usersControllerUpdate({ client, body: changed })).data!;
        onUpdated(updated);
        return { primary: updated.username, email: updated.email ?? "" };
      }}
    />
  );
}
