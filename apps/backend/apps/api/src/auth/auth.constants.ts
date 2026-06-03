import { Role } from '@app/db';

export const IS_PUBLIC_KEY = 'isPublic';
export const IS_ADMIN_KEY = 'isAdmin';
export const ROLE_KEY = 'role';

export const ROLE_LEVELS: Record<Role, number> = {
  [Role.MEMBER]: 1,
  [Role.MANAGER]: 2,
  [Role.OWNER]: 3,
};
