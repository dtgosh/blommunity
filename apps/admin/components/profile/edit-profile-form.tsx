"use client";

// 내 운영자 프로필 수정 — 공통 폼에 어드민 API만 바인딩. PATCH /admins/me 가 없어
// A-AM-03(PATCH /admins/:id)에 본인 id 로 이름·이메일을 전체 갱신한다.
import { EditProfileForm as BaseEditProfileForm } from "@blommunity/frontend-core/profile";
import { adminsControllerUpdate } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import type { components } from "@/lib/api/types";

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
  return (
    <BaseEditProfileForm
      title="기본 정보"
      description="이름과 이메일을 변경할 수 있어요."
      primaryLabel="이름"
      primaryAutoComplete="name"
      primaryPlaceholder="이름"
      primaryRequiredMessage="이름을 입력해 주세요."
      emailRequired
      initialPrimary={initialName}
      initialEmail={initialEmail}
      onSave={async ({ primary, email }) => {
        const updated = (
          await adminsControllerUpdate({
            client,
            path: { id: adminId },
            body: { name: primary, email },
          })
        ).data!;
        onUpdated(updated);
        return { primary: updated.name, email: updated.email ?? "" };
      }}
    />
  );
}
