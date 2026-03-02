import {
  createParamDecorator,
  CustomDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { AccountRole } from 'generated/prisma/enums';
import { RequestWithAuthenticatedUser } from './auth.interfaces';

export const IS_PUBLIC_KEY = 'isPublic';

export const ROLE_KEY = 'role';

export const Public = (): CustomDecorator<string> =>
  SetMetadata(IS_PUBLIC_KEY, true);

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<RequestWithAuthenticatedUser>();

    return request.user;
  },
);

export const Role = (role: AccountRole): CustomDecorator<string> =>
  SetMetadata(ROLE_KEY, role);
