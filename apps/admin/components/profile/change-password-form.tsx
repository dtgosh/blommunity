"use client";

// 비밀번호 변경 (A-AC-03) — 공통 폼에 운영자 엔드포인트만 바인딩.
import { ChangePasswordForm as BaseChangePasswordForm } from "@blommunity/frontend-core/profile";
import { authControllerAdminChangePassword } from "@blommunity/api-client";
import { client } from "@/lib/api/client";

export function ChangePasswordForm() {
  return (
    <BaseChangePasswordForm
      changePassword={(body) => authControllerAdminChangePassword({ client, body })}
    />
  );
}
