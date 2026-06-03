import type { Role, Visibility } from "@blommunity/types";
import { Badge, type BadgeTone } from "./badge";

export const ROLE_TONE: Record<Role, BadgeTone> = {
  OWNER: "accent",
  MANAGER: "warning",
  MEMBER: "neutral",
};

export function RoleBadge({ role, size = "sm" }: { role: Role; size?: "sm" | "md" }) {
  return (
    <Badge tone={ROLE_TONE[role]} size={size}>
      {role}
    </Badge>
  );
}

export function VisibilityBadge({
  visibility,
  size = "sm",
}: {
  visibility: Visibility;
  size?: "sm" | "md";
}) {
  return visibility === "PUBLIC" ? (
    <Badge tone="success" icon="globe" size={size}>PUBLIC</Badge>
  ) : (
    <Badge tone="neutral" icon="lock" size={size}>PRIVATE</Badge>
  );
}
