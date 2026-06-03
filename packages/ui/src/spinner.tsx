import { cn } from "./cn";

export function Spinner({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      role="status"
      aria-label="불러오는 중"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-line-strong border-t-accent",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}

export function LoadingRegion({ label = "불러오는 중…" }: { label?: string }) {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 text-ink-3">
      <Spinner size={22} />
      <span className="text-[13px]">{label}</span>
    </div>
  );
}
