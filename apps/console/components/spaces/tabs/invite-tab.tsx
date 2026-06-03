"use client";

import { InvitePanel } from "@/components/shared/invite-panel";
import {
  spacesControllerFindInvitations,
  spacesControllerCreateInvitation,
  spacesControllerRevokeInvitation,
} from "@blommunity/api-client";
import { client } from "@/lib/api/client";
import type { components } from "@/lib/api/types";

/** Space invite tab (T-SP-07/08/09) — thin wrapper over the shared InvitePanel. */
export function InviteTab({
  space,
  canManage,
}: {
  space: components["schemas"]["SpaceEntity"];
  canManage: boolean;
}) {
  return (
    <InvitePanel
      targetId={space.id}
      targetName={space.name}
      canManage={canManage}
      listInvitations={() => spacesControllerFindInvitations({ client, path: { id: space.id } }).then(r => r.data!)}
      invite={(userId) => spacesControllerCreateInvitation({ client, path: { id: space.id }, body: { inviteeId: userId } })}
      revoke={(invitationId) => spacesControllerRevokeInvitation({ client, path: { id: space.id, invitationId } })}
    />
  );
}
