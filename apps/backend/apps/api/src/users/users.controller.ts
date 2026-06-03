import { Role } from '@app/db';
import { UserService } from '@app/user';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize } from '../api.decorators';
import { Role as RoleDecorator, User } from '../auth/auth.decorators';
import type { UserTokenPayload } from '../auth/auth.interfaces';
import { AuthService } from '../auth/auth.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@ApiTags('계정')
@ApiBearerAuth()
@Serialize()
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  /**
   * 계정 목록 조회
   *
   * @remarks 동일 테넌트에 속한 계정 목록을 조회합니다.
   */
  @Get()
  public async findAll(@User() user: UserTokenPayload): Promise<UserEntity[]> {
    const users = await this.userService.findAll({
      tenantId: user.tenantId,
      deletedAt: null,
    });

    return users.map((user) => new UserEntity(user));
  }

  /**
   * 계정 상세 조회
   *
   * @remarks ID로 단일 계정을 조회합니다. 동일 테넌트에 속한 계정만 조회됩니다.
   */
  @Get(':id')
  public async findOne(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
  ): Promise<UserEntity> {
    const found = await this.userService.findOne({
      id,
      tenantId: user.tenantId,
      deletedAt: null,
    });

    return new UserEntity(found);
  }

  /**
   * 내 프로필 수정
   *
   * @remarks 현재 로그인한 계정의 프로필을 수정합니다.
   */
  @Patch()
  public async update(
    @User() { id, tenantId }: UserTokenPayload,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.userService.update({
      where: { id, tenantId, deletedAt: null },
      data: updateUserDto,
    });

    return new UserEntity(user);
  }

  /**
   * 내 계정 탈퇴
   *
   * @remarks 현재 로그인한 계정을 탈퇴 처리합니다(소프트 삭제).
   */
  @Delete()
  public async remove(
    @User() { id, tenantId }: UserTokenPayload,
  ): Promise<void> {
    await this.userService.remove({ id, tenantId, deletedAt: null });
  }

  /**
   * 계정 삭제
   *
   * @remarks 동일 테넌트에 속한 다른 계정을 삭제합니다(소프트 삭제). MANAGER 이상 권한 필요. 본인과 OWNER 계정은 삭제할 수 없습니다.
   */
  @RoleDecorator(Role.MANAGER)
  @Delete(':id')
  public async removeMember(
    @User() requester: UserTokenPayload,
    @Param('id') id: string,
  ): Promise<void> {
    if (requester.id === id) {
      throw new ForbiddenException('본인은 삭제할 수 없습니다.');
    }

    const target = await this.userService.findOne({
      id,
      tenantId: requester.tenantId,
      deletedAt: null,
    });

    if (target.role === Role.OWNER) {
      throw new BadRequestException('OWNER 계정은 삭제할 수 없습니다.');
    }

    await this.userService.remove({
      id,
      tenantId: requester.tenantId,
      deletedAt: null,
    });
  }

  /**
   * 계정 권한 임명
   *
   * @remarks 동일 테넌트에 속한 다른 계정의 권한을 변경합니다. OWNER 권한 필요. 본인은 변경할 수 없으며, 임명을 통해 한 테넌트에 여러 OWNER가 존재할 수 있습니다.
   */
  @RoleDecorator(Role.OWNER)
  @Patch(':id/role')
  public async assignRole(
    @User() assigner: UserTokenPayload,
    @Param('id') id: string,
    @Body() { role }: AssignRoleDto,
  ): Promise<UserEntity> {
    if (assigner.id === id) {
      throw new ForbiddenException('본인의 권한은 변경할 수 없습니다.');
    }

    const target = await this.userService.findOne({
      id,
      tenantId: assigner.tenantId,
      deletedAt: null,
    });

    if (target.role === role) {
      throw new BadRequestException('이미 해당 권한을 가진 계정입니다.');
    }

    const user = await this.userService.update({
      where: { id, tenantId: assigner.tenantId, deletedAt: null },
      data: { role },
    });

    return new UserEntity(user);
  }

  /**
   * 계정 비밀번호 리셋
   *
   * @remarks 동일 테넌트에 속한 다른 계정의 비밀번호를 새 비밀번호로 강제 변경합니다. MANAGER 이상 권한 필요. 본인과 OWNER 계정은 리셋할 수 없습니다.
   */
  @RoleDecorator(Role.MANAGER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':id/reset-password')
  public async resetPassword(
    @User() requester: UserTokenPayload,
    @Param('id') id: string,
    @Body() { newPassword }: ResetPasswordDto,
  ): Promise<void> {
    if (requester.id === id) {
      throw new ForbiddenException('본인은 리셋할 수 없습니다.');
    }

    const target = await this.userService.findOne({
      id,
      tenantId: requester.tenantId,
      deletedAt: null,
    });

    if (target.role === Role.OWNER) {
      throw new BadRequestException(
        'OWNER 계정의 비밀번호는 리셋할 수 없습니다.',
      );
    }

    await this.authService.resetUserPassword({
      userId: id,
      tenantId: requester.tenantId,
      newPassword,
    });
  }
}
