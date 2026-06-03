// 운영자 가입 신청 — A-AC-01 (email + name + password)
// 가입 후 상태는 PENDING이며, 기존 MANAGER+ 운영자의 승인 전까지 로그인할 수 없습니다.
// 따라서 가입 직후 자동 로그인하지 않고 "승인 대기" 안내를 보여줍니다.
"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Field, Input, PasswordInput } from "@/components/ui/input";
import { FormError } from "@/components/ui/form-error";
import { Icon } from "@/components/ui/icon";
import { authControllerAdminSignUp } from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 해요.");
      return;
    }
    setSubmitting(true);
    try {
      await authControllerAdminSignUp({ client, body: { name, email, password } });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "가입 중 문제가 발생했어요.",
      );
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <AuthCard subtitle="운영자 가입 신청">
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-success-bg text-success">
            <Icon name="check" size={26} />
          </span>
          <div>
            <h2 className="mb-1.5 text-base font-bold text-ink">
              가입 신청이 접수되었어요
            </h2>
            <p className="text-[13.5px] leading-relaxed text-ink-3">
              기존 운영자(MANAGER 이상)의 승인이 끝나면 로그인할 수 있어요.
              승인 결과는 관리자에게 문의해 주세요.
            </p>
          </div>
          <Link href="/login" className="w-full">
            <Button variant="primary" size="lg" full>
              로그인으로 돌아가기
            </Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      subtitle="운영자 가입 신청"
      footer={
        <>
          이미 운영자 계정이 있으신가요?{" "}
          <Link href="/login" className="font-semibold text-accent-text hover:underline">
            로그인
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
        <Field label="이름" htmlFor="name">
          <Input
            id="name"
            inputSize="lg"
            autoComplete="name"
            placeholder="운영자 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          {submitting ? "신청 중…" : "가입 신청"}
        </Button>
      </form>
    </AuthCard>
  );
}
