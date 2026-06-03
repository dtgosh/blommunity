import { Admin, DbService, Role, User } from '@app/db';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { TokenType } from './auth.enums';
import {
  AdminSignInInput,
  AdminSignUpInput,
  AdminTokenPayload,
  ChangeAdminPasswordInput,
  ChangeUserPasswordInput,
  PasswordHolder,
  ResetUserPasswordInput,
  TenantSignUpInput,
  UserSignInInput,
  UserSignUpInput,
  UserTokenPayload,
} from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DbService,
    private readonly jwtService: JwtService,
  ) {}

  public async userSignIn(input: UserSignInInput): Promise<string> {
    const found = await this.dbService.user.findUnique({
      where: {
        tenantId_username: {
          tenantId: input.tenantId,
          username: input.username,
        },
      },
    });

    const user = await this.verifyPassword(found, input.password);

    return this.signUser(user);
  }

  public async adminSignIn(input: AdminSignInInput): Promise<string> {
    const found = await this.dbService.admin.findUnique({
      where: { email: input.email },
    });

    const admin = await this.verifyPassword(found, input.password);

    if (admin.role === Role.MEMBER && !admin.approvedAt) {
      throw new ForbiddenException();
    }

    return this.signAdmin(admin);
  }

  public async userSignUp(input: UserSignUpInput): Promise<string> {
    const password = await this.hashPassword(input.password);

    const user = await this.dbService.user.create({
      data: {
        tenantId: input.tenantId,
        username: input.username,
        email: input.email,
        password,
        role: Role.MEMBER,
      },
    });

    return this.signUser(user);
  }

  public async tenantSignUp(input: TenantSignUpInput): Promise<string> {
    const password = await this.hashPassword(input.password);

    const { users } = await this.dbService.tenant.create({
      select: { users: true },
      data: {
        name: input.tenantName,
        users: {
          create: {
            username: input.username,
            email: input.email,
            password,
            role: Role.OWNER,
          },
        },
      },
    });

    return this.signUser(users[0]);
  }

  public async adminSignUp(input: AdminSignUpInput): Promise<void> {
    const password = await this.hashPassword(input.password);

    await this.dbService.admin.create({
      data: { name: input.name, email: input.email, password },
    });
  }

  public async changeUserPassword({
    userId,
    tenantId,
    currentPassword,
    newPassword,
  }: ChangeUserPasswordInput): Promise<void> {
    const found = await this.dbService.user.findFirst({
      where: { id: userId, tenantId, deletedAt: null },
    });

    await this.verifyPassword(found, currentPassword);

    const password = await this.hashPassword(newPassword);

    await this.dbService.user.update({
      where: { id: userId },
      data: { password },
    });
  }

  public async resetUserPassword({
    userId,
    tenantId,
    newPassword,
  }: ResetUserPasswordInput): Promise<void> {
    const password = await this.hashPassword(newPassword);

    await this.dbService.user.update({
      where: { id: userId, tenantId, deletedAt: null },
      data: { password },
    });
  }

  public async changeAdminPassword({
    adminId,
    currentPassword,
    newPassword,
  }: ChangeAdminPasswordInput): Promise<void> {
    const found = await this.dbService.admin.findFirst({
      where: { id: adminId, deletedAt: null },
    });

    await this.verifyPassword(found, currentPassword);

    const password = await this.hashPassword(newPassword);

    await this.dbService.admin.update({
      where: { id: adminId },
      data: { password },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password, salt);
  }

  private async verifyPassword<T extends PasswordHolder>(
    entity: T | null,
    password: string,
  ): Promise<T> {
    if (!entity || !(await bcrypt.compare(password, entity.password))) {
      throw new UnauthorizedException();
    }

    return entity;
  }

  private signUser({ id, tenantId, role }: User): Promise<string> {
    const payload: UserTokenPayload = {
      type: TokenType.USER,
      id,
      tenantId,
      role,
    };

    return this.jwtService.signAsync(payload);
  }

  private signAdmin({ id, role }: Admin): Promise<string> {
    const payload: AdminTokenPayload = { type: TokenType.ADMIN, id, role };

    return this.jwtService.signAsync(payload);
  }
}
