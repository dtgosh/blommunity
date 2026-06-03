"use client";

import { cn } from "@/lib/cn";
import { Icon } from "./icon";
import type { Visibility } from "@/lib/api/types";

const OPTIONS: { value: Visibility; label: string; icon: "globe" | "lock"; hint: string }[] = [
  { value: "PUBLIC", label: "공개", icon: "globe", hint: "누구나 보고 가입할 수 있어요" },
  { value: "PRIVATE", label: "비공개", icon: "lock", hint: "초대받은 멤버만 들어올 수 있어요" },
];

/** Segmented PUBLIC/PRIVATE chooser used in create/edit forms. */
export function VisibilitySelect({
  value,
  onChange,
}: {
  value: Visibility;
  onChange: (v: Visibility) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {OPTIONS.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={on}
            className={cn(
              "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
              on
                ? "border-accent bg-accent-weak"
                : "border-line-strong bg-surface-1 hover:bg-surface-2",
            )}
          >
            <span
              className={cn(
                "flex items-center gap-1.5 text-[13px] font-semibold",
                on ? "text-accent-text" : "text-ink",
              )}
            >
              <Icon name={o.icon} size={15} />
              {o.label}
            </span>
            <span className="text-[11.5px] leading-snug text-ink-3">
              {o.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
