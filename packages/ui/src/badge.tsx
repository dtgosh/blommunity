import { cn } from "./cn";
import { Icon, type IconName } from "./icon";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

const TONES: Record<BadgeTone, string> = {
  neutral: "text-neutral bg-neutral-bg border-neutral-bd",
  accent: "text-accent-text bg-accent-weak border-transparent",
  success: "text-success bg-success-bg border-success-bd",
  warning: "text-warning bg-warning-bg border-warning-bd",
  danger: "text-danger bg-danger-bg border-danger-bd",
};

export function Badge({
  tone = "neutral",
  size = "md",
  icon,
  children,
}: {
  tone?: BadgeTone;
  size?: "sm" | "md";
  icon?: IconName;
  children: React.ReactNode;
}) {
  const sm = size === "sm";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-[5px] border font-semibold leading-none tracking-[0.01em]",
        sm ? "px-1.5 py-[3px] text-[11px]" : "px-2 py-1 text-[11.5px]",
        TONES[tone],
      )}
    >
      {icon && <Icon name={icon} size={sm ? 11 : 12} strokeWidth={2} />}
      {children}
    </span>
  );
}
