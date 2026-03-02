import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AccountRole } from 'generated/prisma/enums';
import { IS_PUBLIC_KEY, ROLE_KEY } from './auth.decorators';
import { RequestWithAuthenticatedUser, TokenPayload } from './auth.interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  private roleLevels: Record<AccountRole, number> = {
    [AccountRole.OWNER]: 1,
    [AccountRole.ADMIN]: 2,
    [AccountRole.USER]: 3,
  };

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<RequestWithAuthenticatedUser>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token);

      request.user = {
        id: BigInt(payload.sub),
        username: payload.username,
        role: payload.role,
      };
    } catch {
      throw new UnauthorizedException();
    }

    const requiredRole = this.reflector.getAllAndOverride<AccountRole>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (requiredRole) {
      return (
        this.roleLevels[request.user.role] <= this.roleLevels[requiredRole]
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
