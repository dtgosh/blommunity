// 대시보드 — T-OP-04 (통계 대시보드) · 📅 backend 미구현
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export default function DashboardPage() {
  return (
    <PagePlaceholder
      title="대시보드"
      icon="dashboard"
      description="인기 글·신규 가입·트래픽 지표를 한눈에 보여줄 화면입니다. 관련 백엔드 통계 API가 준비되면 카드와 차트를 연결합니다."
      featureIds={["T-OP-04"]}
      status="soon"
    />
  );
}
