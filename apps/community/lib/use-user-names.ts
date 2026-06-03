// 작성자명 해석 훅. 실제 데이터는 (community) 레이아웃의 <UserNamesProvider> 가
// 세션당 한 번만 받아 컨텍스트로 공유한다(컴포넌트마다 재요청하지 않음).
// 반환 형태 { nameOf, loading } 는 그대로라 기존 사용처는 변경이 없다.
export { useUserNamesContext as useUserNames } from "@/components/providers/user-names-provider";
