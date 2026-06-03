import { cn } from "./cn";
import { Icon, type IconName } from "./icon";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const SIZES: Record<ButtonSize, string> = {
  sm: "h-[30px] gap-1.5 px-2.5 text-[13px]",
  md: "h-9 gap-[7px] px-[13px] text-[13.5px]",
  lg: "h-[42px] gap-2 px-4 text-[14.5px]",
};

const ICON_SIZE: Record<ButtonSize, number> = { sm: 14, md: 16, lg: 17 };

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-press shadow-[0_1px_1px_rgba(20,20,40,0.10)]",
  secondary:
    "bg-surface-1 text-ink border border-line-strong hover:bg-surface-2",
  ghost: "bg-transparent text-ink-2 hover:bg-surface-2",
  danger:
    "bg-transparent text-danger border border-line hover:bg-danger-bg hover:border-danger-bd",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  full?: boolean;
}

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  iconRight,
  full,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[6px] border border-transparent font-semibold tracking-[-0.005em] transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        SIZES[size],
        VARIANTS[variant],
        full && "w-full",
        className,
      )}
      {...props}
    >
      {icon && (
        <Icon name={icon} size={ICON_SIZE[size]} strokeWidth={variant === "primary" ? 2 : 1.85} />
      )}
      {children}
      {iconRight && (
        <Icon name={iconRight} size={ICON_SIZE[size]} strokeWidth={1.85} />
      )}
    </button>
  );
}
