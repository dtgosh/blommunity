import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { AccountRole } from 'generated/prisma/enums';

export const ROLE_KEY = 'role';

export const Role = (role: AccountRole): CustomDecorator<string> =>
  SetMetadata(ROLE_KEY, role);
