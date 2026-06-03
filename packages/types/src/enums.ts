// 백엔드 Prisma enum을 미러링. string union으로 유지해 API에서 알 수 없는 값이 와도
// tolerant reader 방식으로 크래시 없이 처리한다.

export type Role = "OWNER" | "MANAGER" | "MEMBER";
export type Visibility = "PUBLIC" | "PRIVATE";
export type MembershipStatus = "PENDING" | "ACTIVE";

export const ROLE_LEVEL: Record<Role, number> = {
  MEMBER: 1,
  MANAGER: 2,
  OWNER: 3,
};

/** `role`이 계층 구조(OWNER > MANAGER > MEMBER)에서 `required` 이상인지 확인한다. */
export function roleAtLeast(role: Role | undefined, required: Role): boolean {
  if (!role) return false;
  return ROLE_LEVEL[role] >= ROLE_LEVEL[required];
}
