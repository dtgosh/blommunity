import { DbService, Prisma } from '@app/db';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import type { AuthRequest } from '../auth/auth.interfaces';

@Injectable()
export class AdminAuditInterceptor implements NestInterceptor {
  private static readonly SENSITIVE_KEYS = [
    'password',
    'currentPassword',
    'newPassword',
  ];

  private readonly logger = new Logger(AdminAuditInterceptor.name);

  constructor(private readonly dbService: DbService) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    if (!request.admin) {
      return next.handle();
    }

    const adminId = request.admin.id;
    const method = request.method;
    const path = request.path;
    const query = this.toJson(request.query);
    const body = this.toJson(this.redact(request.body));

    return next.handle().pipe(
      tap(() => {
        this.dbService.adminAuditLog
          .create({
            data: {
              adminId,
              method,
              path,
              ...(query !== undefined && { query }),
              ...(body !== undefined && { body }),
            },
          })
          .catch((err: unknown) => {
            this.logger.error('Failed to write admin audit log', err);
          });
      }),
    );
  }

  private redact(body: unknown): Record<string, unknown> | undefined {
    if (!body || typeof body !== 'object') {
      return undefined;
    }

    const cloned = { ...(body as Record<string, unknown>) };

    for (const key of AdminAuditInterceptor.SENSITIVE_KEYS) {
      if (key in cloned) {
        cloned[key] = '[REDACTED]';
      }
    }

    return cloned;
  }

  private toJson(obj: unknown): Prisma.InputJsonValue | undefined {
    if (!obj || typeof obj !== 'object' || Object.keys(obj).length === 0) {
      return undefined;
    }

    return obj;
  }
}
