export function BrandMark({
  size = 18,
  color = "#fff",
  line = "var(--color-accent)",
}: {
  size?: number;
  color?: string;
  line?: string;
}) {
  const height = size * 0.86;
  const lineH = Math.max(1.5, size * 0.125);
  return (
    <div
      className="flex shrink-0 flex-col justify-center"
      style={{
        width: size,
        height,
        background: color,
        borderRadius: `${size * 0.3}px ${size * 0.3}px ${size * 0.3}px ${size * 0.08}px`,
        gap: size * 0.13,
        padding: `0 ${size * 0.2}px`,
      }}
    >
      <div className="w-full rounded-full" style={{ height: lineH, background: line }} />
      <div className="w-[58%] rounded-full" style={{ height: lineH, background: line }} />
    </div>
  );
}
