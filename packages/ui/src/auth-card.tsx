"use client";

import { BrandMark } from "./brand-mark";
import { Icon } from "./icon";
import { useTheme } from "./theme-provider";

/** 로그인/회원가입 화면에서 공통으로 쓰이는 브랜드 중앙 레이아웃. */
export function AuthCard({
  subtitle,
  children,
  footer,
}: {
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { theme, toggle } = useTheme();

  return (
    <div className="relative grid min-h-dvh place-items-center bg-surface-0 p-6">
      <button
        type="button"
        onClick={toggle}
        title="테마 전환"
        aria-label="테마 전환"
        className="absolute right-5 top-5 flex size-9 items-center justify-center rounded-lg border border-line bg-surface-1 text-ink-2 hover:bg-surface-2"
      >
        <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
      </button>

      <div className="w-full max-w-[400px]">
        <div className="mb-7 flex flex-col items-center">
          <a href="/" className="mb-5 flex items-center gap-2.5">
            <span className="flex size-[38px] items-center justify-center rounded-[10px] bg-accent">
              <BrandMark size={22} />
            </span>
            <span className="text-[21px] font-extrabold tracking-tight text-ink">
              Blommunity
            </span>
          </a>
          <p className="text-sm text-ink-3">{subtitle}</p>
        </div>

        <div className="rounded-2xl border border-line bg-surface-1 p-7 shadow-[var(--shadow-pop)]">
          {children}
        </div>

        {footer && (
          <div className="mt-5 text-center text-[13px] text-ink-3">{footer}</div>
        )}
      </div>
    </div>
  );
}
