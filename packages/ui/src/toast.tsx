"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Icon, type IconName } from "./icon";

type ToastTone = "success" | "danger" | "neutral";
interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  show: (message: string, tone?: ToastTone) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

const TONE_ICON: Record<ToastTone, IconName> = {
  success: "checkCircle",
  danger: "alertTriangle",
  neutral: "dot",
};
const TONE_CLASS: Record<ToastTone, string> = {
  success: "text-success",
  danger: "text-danger",
  neutral: "text-ink-2",
};

const DURATION = 3200;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  // 언마운트 시 모든 타이머 정리
  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
    };
  }, []);

  const show = useCallback((message: string, tone: ToastTone = "neutral") => {
    const id = ++seq.current;
    setToasts((t) => [...t, { id, message, tone }]);
    const timer = setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
      timers.current.delete(id);
    }, DURATION);
    timers.current.set(id, timer);
  }, []);

  // success/error는 show를 래핑 — value 객체를 메모이즈해 Context 구독자 리렌더 방지
  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (m) => show(m, "success"),
      error: (m) => show(m, "danger"),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-2.5 rounded-xl border border-line bg-surface-1 px-4 py-2.5 text-[13px] font-medium text-ink shadow-[var(--shadow-pop)]"
          >
            <Icon name={TONE_ICON[t.tone]} size={16} className={TONE_CLASS[t.tone]} />
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
