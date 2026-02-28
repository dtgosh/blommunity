import { AccountRole } from 'generated/prisma/enums';
import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  username: string;
  role: AccountRole;
}

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
