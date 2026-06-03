// 신고·모더레이션 — T-OP-01~03 · 📅 backend 미구현
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export default function ModerationPage() {
  return (
    <PagePlaceholder
      title="신고·모더레이션"
      icon="moderation"
      description="신고 목록과 처리(무시/삭제/차단), 금칙어 관리 화면입니다. 관련 백엔드 API가 준비되면 연결합니다."
      featureIds={["T-OP-01~03"]}
      status="soon"
    />
  );
}
