import { Role } from '@app/db';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {
  IS_ADMIN_KEY,
  IS_PUBLIC_KEY,
  ROLE_KEY,
  ROLE_LEVELS,
} from './auth.constants';
import { TokenType } from './auth.enums';
import { AuthRequest, TokenPayload } from './auth.interfaces';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = this.extractToken(request);
    const payload = await this.verifyToken(token);

    this.authorize(context, payload);
    this.attachPayload(request, payload);

    return true;
  }

  private isPublic(context: ExecutionContext): boolean {
    return (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? false
    );
  }

  private extractToken(request: AuthRequest): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }

    return token;
  }

  private async verifyToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync<TokenPayload>(token);
    } catch {
      throw new UnauthorizedException();
    }
  }

  private authorize(context: ExecutionContext, payload: TokenPayload): void {
    const reflectorKeys = [context.getHandler(), context.getClass()];

    const isAdminOnly = this.reflector.getAllAndOverride<boolean>(
      IS_ADMIN_KEY,
      reflectorKeys,
    );

    if (payload.type === TokenType.ADMIN && !isAdminOnly) {
      throw new ForbiddenException();
    }

    if (payload.type === TokenType.USER && isAdminOnly) {
      throw new ForbiddenException();
    }

    const requiredRole = this.reflector.getAllAndOverride<Role>(
      ROLE_KEY,
      reflectorKeys,
    );

    if (requiredRole && ROLE_LEVELS[payload.role] < ROLE_LEVELS[requiredRole]) {
      throw new ForbiddenException();
    }
  }

  private attachPayload(request: AuthRequest, payload: TokenPayload): void {
    switch (payload.type) {
      case TokenType.USER:
        request.user = payload;
        break;
      case TokenType.ADMIN:
        request.admin = payload;
        break;
    }
  }
}
