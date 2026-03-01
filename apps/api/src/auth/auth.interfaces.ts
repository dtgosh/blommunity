import { Request } from 'express';
import { Account } from 'generated/prisma/client';

export interface TokenPayload {
  sub: string;
  username: Account['username'];
  role: Account['role'];
}

export type AuthenticatedUser = Pick<Account, 'id' | 'username' | 'role'>;

export interface RequestWithAuthenticatedUser extends Request {
  user: AuthenticatedUser;
}
