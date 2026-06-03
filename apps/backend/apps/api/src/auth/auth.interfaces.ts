import { Role } from '@app/db';
import { Request } from 'express';
import { TokenType } from './auth.enums';

export interface PasswordHolder {
  password: string;
}

interface TokenPayloadBase {
  id: string;
  role: Role;
}

export interface UserTokenPayload extends TokenPayloadBase {
  type: typeof TokenType.USER;
  tenantId: string;
}

export interface AdminTokenPayload extends TokenPayloadBase {
  type: typeof TokenType.ADMIN;
}

export type TokenPayload = UserTokenPayload | AdminTokenPayload;

export interface AuthRequest extends Request {
  user?: UserTokenPayload;
  admin?: AdminTokenPayload;
}

interface UserCredentials {
  tenantId: string;
  username: string;
  password: string;
}

interface AdminCredentials {
  email: string;
  password: string;
}

export type UserSignInInput = UserCredentials;

export interface UserSignUpInput extends UserCredentials {
  email?: string;
}

export interface TenantSignUpInput {
  tenantName: string;
  username: string;
  email: string;
  password: string;
}

export type AdminSignInInput = AdminCredentials;

export interface AdminSignUpInput extends AdminCredentials {
  name: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeUserPasswordInput extends ChangePasswordInput {
  userId: string;
  tenantId: string;
}

export interface ChangeAdminPasswordInput extends ChangePasswordInput {
  adminId: string;
}

export interface ResetUserPasswordInput {
  userId: string;
  tenantId: string;
  newPassword: string;
}
