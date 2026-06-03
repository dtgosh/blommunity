import { Icon, type IconName } from "./icon";

export function EmptyState({
  icon = "spaces",
  title,
  description,
  action,
  tone = "neutral",
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: React.ReactNode;
  tone?: "neutral" | "danger";
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div
        className={
          "flex size-12 items-center justify-center rounded-xl " +
          (tone === "danger"
            ? "bg-danger-bg text-danger"
            : "bg-surface-2 text-ink-3")
        }
      >
        <Icon name={tone === "danger" ? "alertTriangle" : icon} size={22} />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {description && (
          <p className="max-w-xs text-[13px] leading-relaxed text-ink-3">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
