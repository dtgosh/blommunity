import { BrandMark } from "./brand-mark";

/** 세션 로딩 중 표시되는 전체 화면 브랜드 스피너. */
export function LoadingScreen() {
  return (
    <div className="grid h-dvh place-items-center bg-surface-0">
      <div className="flex flex-col items-center gap-3">
        <span className="flex size-10 animate-pulse items-center justify-center rounded-xl bg-accent">
          <BrandMark size={22} />
        </span>
        <span className="text-[13px] text-ink-3">불러오는 중…</span>
      </div>
    </div>
  );
}
