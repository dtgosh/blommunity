import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccountRole } from 'generated/prisma/enums';
import { RequestWithUser } from '../auth.interfaces';
import { ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  private roleLevels: Record<AccountRole, number> = {
    [AccountRole.OWNER]: 1,
    [AccountRole.ADMIN]: 2,
    [AccountRole.USER]: 3,
  };

  constructor(private reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<AccountRole>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    return this.roleLevels[user.role] <= this.roleLevels[requiredRole];
  }
}
