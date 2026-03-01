import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithAuthenticatedUser } from '../auth.interfaces';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<RequestWithAuthenticatedUser>();

    return request.user;
  },
);
