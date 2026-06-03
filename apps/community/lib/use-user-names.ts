"use client";

import { useEffect, useState } from "react";
import { usersControllerFindAll } from "@blommunity/api-client";
import { client } from "@/lib/api/client";

/**
 * The community needs author names, but posts/comments only carry `authorId`
 * (the backend serializes scalar fields, no nested user — same pattern as the
 * console). We fetch the tenant's user list once (GET /users) and build an
 * id→username map. Returns a resolver that falls back to a short id slice when a
 * name isn't found (e.g. a deleted user).
 */
export function useUserNames(): {
  nameOf: (userId: string) => string;
  loading: boolean;
} {
  const [map, setMap] = useState<Map<string, string> | null>(null);

  useEffect(() => {
    let cancelled = false;
    usersControllerFindAll({ client })
      .then((r) => {
        if (cancelled) return;
        setMap(new Map(r.data!.map((u) => [u.id, u.username])));
      })
      .catch(() => {
        if (!cancelled) setMap(new Map());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    loading: map === null,
    nameOf: (userId: string) =>
      map?.get(userId) ?? `사용자 ${userId.slice(0, 6)}`,
  };
}
