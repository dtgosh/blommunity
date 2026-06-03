"use client";

import { forwardRef, useState } from "react";
import { cn } from "./cn";
import { Icon } from "./icon";

export const INPUT_BASE =
  "w-full rounded-lg border border-line-strong bg-surface-1 text-ink outline-none transition-colors placeholder:text-ink-3 focus-visible:border-accent disabled:opacity-60";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  inputSize?: "md" | "lg";
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, inputSize = "md", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        INPUT_BASE,
        inputSize === "lg"
          ? "h-[42px] px-[13px] text-sm"
          : "h-[38px] px-3 text-[13px]",
        className,
      )}
      {...props}
    />
  );
});

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  function PasswordInput({ className, inputSize = "lg", ...props }, ref) {
    const [show, setShow] = useState(false);
    return (
      <div className="relative">
        <input
          ref={ref}
          type={show ? "text" : "password"}
          className={cn(
            INPUT_BASE,
            inputSize === "lg"
              ? "h-[42px] pl-[13px] pr-11 text-sm"
              : "h-[38px] pl-3 pr-10 text-[13px]",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          title={show ? "비밀번호 숨기기" : "비밀번호 표시"}
          aria-label={show ? "비밀번호 숨기기" : "비밀번호 표시"}
          className="absolute right-1.5 top-1/2 flex size-[30px] -translate-y-1/2 items-center justify-center rounded-md text-ink-3 hover:bg-surface-2"
        >
          <Icon name={show ? "eyeOff" : "eye"} size={16} />
        </button>
      </div>
    );
  },
);

export function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-[7px] block text-[13px] font-semibold text-ink-2", className)}
      {...props}
    >
      {children}
    </label>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="mt-1.5 text-[12px] text-ink-3">{hint}</p>}
    </div>
  );
}
