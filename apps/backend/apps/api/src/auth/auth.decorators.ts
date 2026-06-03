import { Role as RoleType } from '@app/db';
import {
  createParamDecorator,
  CustomDecorator,
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { IS_ADMIN_KEY, IS_PUBLIC_KEY, ROLE_KEY } from './auth.constants';
import {
  AdminTokenPayload,
  AuthRequest,
  UserTokenPayload,
} from './auth.interfaces';

export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);

export const AdminOnly = (): CustomDecorator => SetMetadata(IS_ADMIN_KEY, true);

export const Role = (role: RoleType): CustomDecorator =>
  SetMetadata(ROLE_KEY, role);

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserTokenPayload => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();

    if (!request.user) {
      throw new UnauthorizedException();
    }

    return request.user;
  },
);

export const Admin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AdminTokenPayload => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();

    if (!request.admin) {
      throw new UnauthorizedException();
    }

    return request.admin;
  },
);
