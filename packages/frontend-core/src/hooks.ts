"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ApiError } from "@blommunity/types";

function toMessage(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

// ───────────────────────── useFetchList ─────────────────────────
// 마스터 목록 + 선택 상태. 13개 *-screen 이 반복하던
// useState(data/error) + selectedId + loadList(selectFirst) + useEffect + selected useMemo
// 패턴을 한 번에 대체한다. 빈/검색 필터링은 화면이 직접 한다(문구가 화면별).

export interface UseFetchListResult<T> {
  /** null = 최초 로딩 중, [] = 로딩 완료(빈 목록) 또는 에러. */
  data: T[] | null;
  error: string | null;
  loading: boolean;
  /** 재조회. selectFirst=true 면 선택이 없을 때 첫 항목을 자동 선택. */
  reload: (selectFirst?: boolean) => Promise<void>;
  setData: Dispatch<SetStateAction<T[] | null>>;
  selectedId: string | null;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  selected: T | null;
}

export function useFetchList<T extends { id: string }>(
  fetcher: () => Promise<T[]>,
  options?: { errorMessage?: string; autoSelectFirst?: boolean },
): UseFetchListResult<T> {
  const errorMessage = options?.errorMessage ?? "목록을 불러오지 못했어요.";
  const autoSelectFirst = options?.autoSelectFirst ?? true;

  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const reload = useCallback(
    async (selectFirst = false) => {
      setError(null);
      try {
        const list = await fetcherRef.current();
        setData(list);
        if (selectFirst && list.length > 0) {
          setSelectedId((cur) => cur ?? list[0].id);
        }
      } catch (err) {
        setData([]);
        setError(toMessage(err, errorMessage));
      }
    },
    [errorMessage],
  );

  useEffect(() => {
    void reload(autoSelectFirst);
  }, [reload, autoSelectFirst]);

  const selected = useMemo(
    () => data?.find((item) => item.id === selectedId) ?? null,
    [data, selectedId],
  );

  return {
    data,
    error,
    loading: data === null,
    reload,
    setData,
    selectedId,
    setSelectedId,
    selected,
  };
}

// ───────────────────────── useFetchOne ─────────────────────────
// 선택 항목의 상세 로더. id 변경 시 cancellation 플래그로 경쟁 조건을 막는
// ~25줄 패턴을 캡슐화한다. id 가 null 이면 데이터/에러를 비운다. reload 는
// 마지막 정상 데이터를 유지하며 조용히 갱신(수정 후 새로고침 용).

export interface UseFetchOneResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  setData: Dispatch<SetStateAction<T | null>>;
}

export function useFetchOne<T>(
  id: string | null,
  fetcher: (id: string) => Promise<T>,
  options?: { errorMessage?: string },
): UseFetchOneResult<T> {
  const errorMessage = options?.errorMessage ?? "불러오지 못했어요.";

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!id) {
      setData(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcherRef
      .current(id)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (cancelled) return;
        setData(null);
        setError(toMessage(err, errorMessage));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, errorMessage]);

  const reload = useCallback(async () => {
    if (!id) return;
    try {
      setData(await fetcherRef.current(id));
    } catch {
      /* keep last good data */
    }
  }, [id]);

  return { data, loading, error, reload, setData };
}

// ───────────────────────── useSubmit ─────────────────────────
// 폼/모달의 공통 제출 래퍼: error + pending + try/catch. 필드 상태·검증은
// 폼별로 다르므로 화면이 직접 관리하고, 검증 통과 후 run() 을 호출한다.
// 성공 시 pending 을 유지한다(보통 onClose 로 즉시 언마운트되는 패턴).

export interface UseSubmitResult {
  pending: boolean;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  /** fn 을 error/pending 으로 감싼다. 성공 시 true, 실패 시 false 를 반환. */
  run: (fn: () => Promise<void>, errorMessage?: string) => Promise<boolean>;
}

export function useSubmit(): UseSubmitResult {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (fn: () => Promise<void>, errorMessage = "저장하지 못했어요.") => {
      setError(null);
      setPending(true);
      try {
        await fn();
        return true;
      } catch (err) {
        setError(toMessage(err, errorMessage));
        setPending(false);
        return false;
      }
    },
    [],
  );

  return { pending, error, setError, run };
}

// ───────────────────────── useAuthForm ─────────────────────────
// 로그인/회원가입 페이지의 공통 제출 래퍼. signIn→login(token)→redirect 액션을
// error/submitting 으로 감싸고, 401 은 자격증명 안내 문구로 매핑한다. 성공 시
// 보통 redirect 로 언마운트되므로 submitting 을 유지한다.

export interface UseAuthFormResult {
  error: string | null;
  submitting: boolean;
  submit: (
    action: () => Promise<void>,
    options?: { unauthorizedMessage?: string; fallbackMessage?: string },
  ) => Promise<void>;
}

export function useAuthForm(): UseAuthFormResult {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(
    async (
      action: () => Promise<void>,
      options?: { unauthorizedMessage?: string; fallbackMessage?: string },
    ) => {
      setError(null);
      setSubmitting(true);
      try {
        await action();
      } catch (err) {
        const fallback = options?.fallbackMessage ?? "요청 중 문제가 발생했어요.";
        if (err instanceof ApiError) {
          setError(
            err.status === 401 && options?.unauthorizedMessage
              ? options.unauthorizedMessage
              : err.message,
          );
        } else {
          setError(fallback);
        }
        setSubmitting(false);
      }
    },
    [],
  );

  return { error, submitting, submit };
}
