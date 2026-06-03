"use client";

// 비밀번호 변경 (T-AC-04) — 공통 폼에 사용자 엔드포인트만 바인딩.
import { ChangePasswordForm as BaseChangePasswordForm } from "@blommunity/frontend-core/profile";
import { authControllerChangePassword } from "@blommunity/api-client";
import { client } from "@/lib/api/client";

export function ChangePasswordForm() {
  return (
    <BaseChangePasswordForm
      changePassword={(body) => authControllerChangePassword({ client, body })}
    />
  );
}
