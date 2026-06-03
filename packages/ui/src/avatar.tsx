import { cn } from "./cn";

const PALETTE: ReadonlyArray<readonly [string, string]> = [
  ["#4f46e5", "#fff"],
  ["#0e7490", "#fff"],
  ["#b45309", "#fff"],
  ["#9333ea", "#fff"],
  ["#15803d", "#fff"],
  ["#be123c", "#fff"],
  ["#475569", "#fff"],
  ["#0369a1", "#fff"],
];

export function Avatar({
  name,
  size = 32,
  idx = 0,
  ring = false,
  className,
}: {
  name: string;
  size?: number;
  idx?: number;
  ring?: boolean;
  className?: string;
}) {
  const [bg, fg] = PALETTE[idx % PALETTE.length];
  const ch = (name || "?").trim().charAt(0);
  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 select-none items-center justify-center rounded-full font-semibold leading-none",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize: size * 0.42,
        boxShadow: ring ? "0 0 0 2px var(--color-surface-1)" : undefined,
      }}
    >
      {ch}
    </div>
  );
}
