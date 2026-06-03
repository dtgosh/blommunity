// 대시보드 — A-ST-01·02 (플랫폼 지표) · 📅 backend 미구현
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export default function DashboardPage() {
  return (
    <PagePlaceholder
      title="대시보드"
      icon="dashboard"
      description="전체 테넌트·사용자·게시물 수와 활성도 추이를 한눈에 보여줄 화면입니다. 관련 백엔드 통계 API가 준비되면 카드와 차트를 연결합니다."
      featureIds={["A-ST-01", "A-ST-02"]}
      status="soon"
    />
  );
}
