"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usersControllerFindAll } from "@blommunity/api-client";
import { client } from "@/lib/api/client";

/**
 * 테넌트 사용자 목록(GET /users)을 세션당 한 번만 받아 id→username 맵을 공유한다.
 * 게시판/글/댓글 화면이 각자 useUserNames 를 호출해도 fetch 는 한 번만 일어난다.
 * (이전: 컴포넌트 마운트마다 전체 사용자 목록을 재요청)
 */
interface UserNamesValue {
  nameOf: (userId: string) => string;
  loading: boolean;
}

const UserNamesContext = createContext<UserNamesValue | null>(null);

export function UserNamesProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<Map<string, string> | null>(null);

  useEffect(() => {
    let cancelled = false;
    usersControllerFindAll({ client })
      .then((r) => {
        if (!cancelled) setMap(new Map(r.data!.map((u) => [u.id, u.username])));
      })
      .catch(() => {
        if (!cancelled) setMap(new Map());
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<UserNamesValue>(
    () => ({
      loading: map === null,
      nameOf: (userId: string) =>
        map?.get(userId) ?? `사용자 ${userId.slice(0, 6)}`,
    }),
    [map],
  );

  return (
    <UserNamesContext.Provider value={value}>
      {children}
    </UserNamesContext.Provider>
  );
}

export function useUserNamesContext(): UserNamesValue {
  const ctx = useContext(UserNamesContext);
  if (!ctx)
    throw new Error("useUserNames must be used within <UserNamesProvider>");
  return ctx;
}
