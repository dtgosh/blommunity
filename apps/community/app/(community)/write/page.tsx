// 글쓰기 / 수정 — U-PT-01 / U-PT-04 (✅)
// useSearchParams 사용 컴포넌트는 Suspense 경계가 필요합니다(Next 15).
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { PostComposer } from "@/components/posts/post-composer";

export default function WritePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      }
    >
      <PostComposer />
    </Suspense>
  );
}
