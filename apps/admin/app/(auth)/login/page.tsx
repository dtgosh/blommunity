// 운영자 로그인 — A-AC-02 (email + password)
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthForm } from "@blommunity/frontend-core/hooks";
import { AuthCard } from "@/components/auth/auth-card";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Field, Input, PasswordInput } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { authControllerAdminSignIn } from "@blommunity/api-client";
import { client } from "@/lib/api/client";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { error, submitting, submit } = useAuthForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submit(
      async () => {
        const token = (await authControllerAdminSignIn({ client, body: { email, password } })).data!;
        await login(token);
        router.replace("/admin");
      },
      {
        unauthorizedMessage: "이메일 또는 비밀번호가 올바르지 않아요.",
        fallbackMessage: "로그인 중 문제가 발생했어요.",
      },
    );
  }

  return (
    <AuthCard
      subtitle="운영자 어드민 로그인"
      footer={
        <>
          운영자 계정이 없으신가요?{" "}
          <Link href="/signup" className="font-semibold text-accent-text hover:underline">
            가입 신청
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
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
