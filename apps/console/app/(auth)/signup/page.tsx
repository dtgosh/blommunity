// 회원가입 — T-AC-01 (테넌트 + 최초 Owner 사용자 동시 생성)
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Field, Input, PasswordInput } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { authControllerTenantSignUp } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [tenantName, setTenantName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 해요.");
      return;
    }
    setSubmitting(true);
    try {
      const token = (await authControllerTenantSignUp({ client, body: { tenantName, username, email, password } })).data!;
      await login(token);
      router.replace("/console");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "가입 중 문제가 발생했어요.",
      );
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      subtitle="새 커뮤니티 시작하기"
      footer={
        <>
          이미 커뮤니티가 있으신가요?{" "}
          <Link href="/login" className="font-semibold text-accent-text hover:underline">
            로그인
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
        <Field
          label="커뮤니티 이름"
          htmlFor="tenantName"
          hint="멤버에게 보이는 커뮤니티의 이름이에요. 가입과 동시에 당신이 OWNER가 됩니다."
        >
          <Input
            id="tenantName"
            inputSize="lg"
            placeholder="예: 북클럽"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            required
          />
        </Field>
        <Field label="아이디" htmlFor="username">
          <Input
            id="username"
            inputSize="lg"
            autoComplete="username"
            placeholder="로그인에 사용할 아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Field>
        <Field label="이메일" htmlFor="email">
          <Input
            id="email"
            type="email"
            inputSize="lg"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field label="비밀번호" htmlFor="password" hint="8자 이상">
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
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
          {submitting ? "만드는 중…" : "커뮤니티 만들기"}
        </Button>
      </form>
    </AuthCard>
  );
}
