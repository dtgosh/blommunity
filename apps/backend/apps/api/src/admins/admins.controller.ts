import { AdminService } from '@app/admin';
import { Role } from '@app/db';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Admin,
  AdminOnly,
  Role as RoleDecorator,
} from '../auth/auth.decorators';
import type { AdminTokenPayload } from '../auth/auth.interfaces';
import { AdminStatus } from './admins.enums';
import { AssignRoleDto } from './dto/assign-role.dto';
import { ListAdminsQueryDto } from './dto/list-admins-query.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminEntity } from './entities/admin.entity';

@ApiTags('관리자')
@ApiBearerAuth()
@AdminOnly()
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * 관리자 목록 조회
   *
   * @remarks 관리자 목록을 조회합니다. `status` 쿼리로 승인 상태로 필터링할 수 있습니다.
   */
  @Get()
  public async findAll(
    @Query() { status }: ListAdminsQueryDto,
  ): Promise<AdminEntity[]> {
    const admins = await this.adminService.findAll({
      deletedAt: null,
      ...(status === AdminStatus.PENDING && { approvedAt: null }),
      ...(status === AdminStatus.APPROVED && { approvedAt: { not: null } }),
    });

    return admins.map((admin) => new AdminEntity(admin));
  }

  /**
   * 관리자 상세 조회
   *
   * @remarks ID로 단일 관리자를 조회합니다.
   */
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<AdminEntity> {
    const admin = await this.adminService.findOne({ id, deletedAt: null });

    return new AdminEntity(admin);
  }

  /**
   * 관리자 수정
   *
   * @remarks 관리자 정보를 수정합니다.
   */
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<AdminEntity> {
    const admin = await this.adminService.update({
      where: { id, deletedAt: null },
      data: updateAdminDto,
    });

    return new AdminEntity(admin);
  }

  /**
   * 관리자 승인
   *
   * @remarks 승인 대기 중인 MEMBER 관리자를 승인합니다. MANAGER 이상 권한 필요.
   */
  @RoleDecorator(Role.MANAGER)
  @Post(':id/approve')
  public async approve(
    @Admin() approver: AdminTokenPayload,
    @Param('id') id: string,
  ): Promise<AdminEntity> {
    const target = await this.adminService.findOne({ id, deletedAt: null });

    if (target.role !== Role.MEMBER) {
      throw new BadRequestException('MEMBER 권한 관리자만 승인할 수 있습니다.');
    }

    if (target.approvedAt) {
      throw new BadRequestException('이미 승인된 관리자입니다.');
    }

    const admin = await this.adminService.update({
      where: { id, deletedAt: null },
      data: { approvedAt: new Date(), approverId: approver.id },
    });

    return new AdminEntity(admin);
  }

  /**
   * 관리자 승인 회수
   *
   * @remarks 승인된 MEMBER 관리자를 다시 대기 상태로 되돌립니다. MANAGER 이상 권한 필요. 본인 승인은 회수할 수 없습니다.
   */
  @RoleDecorator(Role.MANAGER)
  @Delete(':id/approve')
  public async revokeApproval(
    @Admin() revoker: AdminTokenPayload,
    @Param('id') id: string,
  ): Promise<AdminEntity> {
    if (revoker.id === id) {
      throw new ForbiddenException();
    }

    const target = await this.adminService.findOne({ id, deletedAt: null });

    if (target.role !== Role.MEMBER) {
      throw new BadRequestException(
        'MEMBER 권한 관리자의 승인만 회수할 수 있습니다.',
      );
    }

    if (!target.approvedAt) {
      throw new BadRequestException('승인되지 않은 관리자입니다.');
    }

    const admin = await this.adminService.update({
      where: { id, deletedAt: null },
      data: { approvedAt: null, approverId: null },
    });

    return new AdminEntity(admin);
  }

  /**
   * 관리자 권한 임명
   *
   * @remarks 대상 관리자의 권한을 MANAGER 또는 MEMBER로 변경합니다. OWNER 권한 필요. 본인은 변경할 수 없으며, MEMBER로 임명될 때 자동 승인됩니다.
   */
  @RoleDecorator(Role.OWNER)
  @Patch(':id/role')
  public async assignRole(
    @Admin() assigner: AdminTokenPayload,
    @Param('id') id: string,
    @Body() { role }: AssignRoleDto,
  ): Promise<AdminEntity> {
    if (assigner.id === id) {
      throw new ForbiddenException('본인의 권한은 변경할 수 없습니다.');
    }

    const target = await this.adminService.findOne({ id, deletedAt: null });

    if (target.role === Role.OWNER) {
      throw new BadRequestException('OWNER의 권한은 변경할 수 없습니다.');
    }

    if (target.role === role) {
      throw new BadRequestException('이미 해당 권한을 가진 관리자입니다.');
    }

    const admin = await this.adminService.update({
      where: { id, deletedAt: null },
      data: {
        role,
        approvedAt: target.approvedAt ?? new Date(),
        approverId: target.approverId ?? assigner.id,
      },
    });

    return new AdminEntity(admin);
  }

  /**
   * 관리자 삭제
   *
   * @remarks 관리자를 삭제합니다(소프트 삭제). MANAGER 이상 권한 필요. 본인은 삭제할 수 없습니다.
   */
  @RoleDecorator(Role.MANAGER)
  @Delete(':id')
  public async remove(
    @Admin() requester: AdminTokenPayload,
    @Param('id') id: string,
  ): Promise<void> {
    if (requester.id === id) {
      throw new ForbiddenException('본인은 삭제할 수 없습니다.');
    }

    await this.adminService.remove({ id, deletedAt: null });
  }
}
