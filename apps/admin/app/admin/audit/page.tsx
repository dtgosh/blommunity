// 감사 로그 — A-AL-02 (활동 로그 조회) · 📅 backend 조회 API 미구현
// (활동 기록 A-AL-01·민감정보 마스킹 A-AL-03은 백엔드에서 자동 동작하지만,
//  이를 조회하는 엔드포인트가 아직 없습니다.)
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export default function AuditPage() {
  return (
    <PagePlaceholder
      title="감사 로그"
      icon="activity"
      description="운영자 활동 로그를 시간순·운영자별·경로별로 조회하는 화면입니다. 활동 기록 자체는 백엔드에서 자동 저장되지만, 조회 API가 준비되면 목록과 필터를 연결합니다."
      featureIds={["A-AL-02"]}
      status="soon"
    />
  );
}
