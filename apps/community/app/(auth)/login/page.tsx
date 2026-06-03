// 로그인 — U-AC-02 (회원 로그인: tenantId + username + password)
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Field, Input, PasswordInput } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { authControllerSignIn } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [tenantId, setTenantId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const token = (await authControllerSignIn({ client, body: { tenantId, username, password } })).data!;
      await login(token);
      router.replace("/");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.status === 401
            ? "아이디 또는 비밀번호가 올바르지 않아요."
            : err.message
          : "로그인 중 문제가 발생했어요.",
      );
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      subtitle="커뮤니티 로그인"
      footer={
        <>
          아직 회원이 아니신가요?{" "}
          <Link href="/signup" className="font-semibold text-accent-text hover:underline">
            회원가입
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
        <Field label="커뮤니티 아이디" htmlFor="tenantId" hint="가입한 커뮤니티의 아이디예요.">
          <Input
            id="tenantId"
            inputSize="lg"
            autoComplete="organization"
            placeholder="예: bookclub"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            required
          />
        </Field>
        <Field label="아이디" htmlFor="username">
          <Input
            id="username"
            inputSize="lg"
            autoComplete="username"
            placeholder="사용자 아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Field>
        <Field label="비밀번호" htmlFor="password">
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>

        <FormError message={error} />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          full
          disabled={submitting}
          className="mt-1"
        >
          {submitting ? "로그인 중…" : "로그인"}
        </Button>
      </form>
    </AuthCard>
  );
}
