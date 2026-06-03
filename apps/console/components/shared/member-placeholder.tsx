import { EmptyState } from "@/components/ui/empty-state";

/**
 * Shared "멤버 목록 준비 중" placeholder for space/board detail. The backend has
 * no member-list / role-change / leave endpoints yet (T-SP-13·14·15,
 * T-BD-13·14·15 are 📅) and detail responses include no relations, so there is
 * no honest member data to show. Inviting works via the 초대 tab.
 */
export function MemberPlaceholder({ featureIds }: { featureIds: string }) {
  return (
    <div className="p-5">
      <EmptyState
        icon="members"
        title="멤버 목록은 준비 중이에요"
        description={`멤버 조회·역할 변경 API(${featureIds})가 준비되면 여기에서 멤버를 관리할 수 있어요. 지금은 ‘초대’ 탭에서 새 멤버를 초대할 수 있어요.`}
      />
    </div>
  );
}
