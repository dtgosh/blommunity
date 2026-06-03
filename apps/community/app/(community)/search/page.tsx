// 검색 — U-PT-12 (게시물 검색) · 📅 backend 미구현
import { EmptyState } from "@/components/ui/empty-state";

export default function SearchPage() {
  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-xl font-bold tracking-tight text-ink">검색</h1>
        <p className="mt-1 text-[13.5px] text-ink-3">
          제목·본문·태그로 글을 찾는 화면이에요.
        </p>
      </header>
      <div className="rounded-[12px] border border-dashed border-line py-10">
        <EmptyState
          icon="search"
          title="검색은 준비 중이에요"
          description="게시물 전문 검색(U-PT-12) 백엔드가 준비되면 검색 바와 결과 목록을 연결합니다."
        />
      </div>
    </div>
  );
}
