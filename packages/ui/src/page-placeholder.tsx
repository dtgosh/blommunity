import { Badge } from "./badge";
import { Icon, type IconName } from "./icon";

export function PagePlaceholder({
  title,
  icon,
  description,
  featureIds,
  status,
}: {
  title: string;
  icon: IconName;
  description?: string;
  featureIds?: string[];
  status: "soon" | "todo";
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-surface-2 text-ink-3">
        <Icon name={icon} size={26} />
      </div>
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-ink">{title}</h1>
        {description && (
          <p className="max-w-md text-sm leading-relaxed text-ink-2">{description}</p>
        )}
      </div>
      <Badge tone={status === "soon" ? "warning" : "accent"}>
        {status === "soon" ? "준비 중" : "곧 구현"}
      </Badge>
      {featureIds && featureIds.length > 0 && (
        <code className="text-xs text-ink-3">{featureIds.join(" · ")}</code>
      )}
    </div>
  );
}
