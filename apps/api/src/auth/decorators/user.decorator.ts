import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../auth.interfaces';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    return request.user;
  },
);
