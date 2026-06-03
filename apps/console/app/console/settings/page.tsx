// 사이트 설정 — T-ST-01~05 · 📅 backend 미구현
import { PagePlaceholder } from "@/components/ui/page-placeholder";

export default function SettingsPage() {
  return (
    <PagePlaceholder
      title="사이트 설정"
      icon="settings"
      description="기본 정보, 테마/디자인, 도메인 연결, 가입 정책, SEO 메타를 관리하는 화면입니다. 관련 백엔드 API가 준비되면 연결합니다."
      featureIds={["T-ST-01~05"]}
      status="soon"
    />
  );
}
