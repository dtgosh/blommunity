import { User } from '../auth/auth.decorators';
import type { UserTokenPayload } from '../auth/auth.interfaces';
import { DbService, MembershipStatus, Role, Visibility } from '@app/db';
import { SpaceService } from '@app/space';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize } from '../api.decorators';
import { CreateSpaceDto } from './dto/create-space.dto';
import { InviteSpaceUserDto } from './dto/invite-space-user.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { SpaceUserEntity } from './entities/space-user.entity';
import { SpaceEntity } from './entities/space.entity';

@ApiTags('공간')
@ApiBearerAuth()
@Serialize()
@Controller('spaces')
export class SpacesController {
  constructor(
    private readonly spaceService: SpaceService,
    private readonly dbService: DbService,
  ) {}

  /**
   * 공간 생성
   *
   * @remarks 새로운 공간을 생성합니다. 생성한 사용자가 소유자(OWNER)로 등록됩니다.
   */
  @Post()
  public async create(
    @User() { tenantId, id }: UserTokenPayload,
    @Body() createSpaceDto: CreateSpaceDto,
  ): Promise<SpaceEntity> {
    const space = await this.spaceService.create({
      ...createSpaceDto,
      tenantId,
      users: {
        create: {
          tenantId,
          userId: id,
          role: Role.OWNER,
          status: MembershipStatus.ACTIVE,
        },
      },
    });

    return new SpaceEntity(space);
  }

  /**
   * 공간 목록 조회
   *
   * @remarks 접근 가능한 공간 목록을 조회합니다. 공개(PUBLIC) 공간과 본인이 멤버(ACTIVE)인 비공개(PRIVATE) 공간이 반환됩니다.
   */
  @Get()
  public async findAll(@User() user: UserTokenPayload): Promise<SpaceEntity[]> {
    const spaces = await this.spaceService.findAll({
      tenantId: user.tenantId,
      deletedAt: null,
      OR: [
        { visibility: Visibility.PUBLIC },
        {
          visibility: Visibility.PRIVATE,
          users: {
            some: { userId: user.id, status: MembershipStatus.ACTIVE },
          },
        },
      ],
    });

    return spaces.map((space) => new SpaceEntity(space));
  }

  /**
   * 내 공간 초대 목록 조회
   *
   * @remarks 본인이 받은 대기 중(PENDING) 공간 초대 목록을 조회합니다.
   */
  @Get('invitations/me')
  public async findMyInvitations(
    @User() user: UserTokenPayload,
  ): Promise<SpaceUserEntity[]> {
    const invitations = await this.dbService.spaceUser.findMany({
      where: {
        tenantId: user.tenantId,
        userId: user.id,
        status: MembershipStatus.PENDING,
      },
      orderBy: { createdAt: 'desc' },
    });

    return invitations.map((invitation) => new SpaceUserEntity(invitation));
  }

  /**
   * 공간 초대 수락
   *
   * @remarks 본인에게 발송된 대기 중 공간 초대를 수락하고 해당 공간의 멤버(ACTIVE)로 등록됩니다.
   */
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('invitations/:invitationId/accept')
  public async acceptInvitation(
    @User() user: UserTokenPayload,
    @Param('invitationId') invitationId: string,
  ): Promise<void> {
    const invitation = await this.dbService.spaceUser.findFirst({
      where: {
        id: invitationId,
        tenantId: user.tenantId,
        userId: user.id,
      },
    });

    if (!invitation) {
      throw new NotFoundException('초대를 찾을 수 없습니다.');
    }

    if (invitation.status !== MembershipStatus.PENDING) {
      throw new BadRequestException('대기 중인 초대만 응답할 수 있습니다.');
    }

    await this.dbService.spaceUser.update({
      where: { id: invitationId },
      data: { status: MembershipStatus.ACTIVE },
    });
  }

  /**
   * 공간 초대 거절
   *
   * @remarks 본인에게 발송된 대기 중 공간 초대를 거절합니다. 초대 레코드가 삭제됩니다.
   */
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('invitations/:invitationId/decline')
  public async declineInvitation(
    @User() user: UserTokenPayload,
    @Param('invitationId') invitationId: string,
  ): Promise<void> {
    const invitation = await this.dbService.spaceUser.findFirst({
      where: {
        id: invitationId,
        tenantId: user.tenantId,
        userId: user.id,
      },
    });

    if (!invitation) {
      throw new NotFoundException('초대를 찾을 수 없습니다.');
    }

    if (invitation.status !== MembershipStatus.PENDING) {
      throw new BadRequestException('대기 중인 초대만 응답할 수 있습니다.');
    }

    await this.dbService.spaceUser.delete({ where: { id: invitationId } });
  }

  /**
   * 공간 상세 조회
   *
   * @remarks ID로 단일 공간을 조회합니다. 접근 권한이 없는 비공개 공간은 조회되지 않습니다.
   */
  @Get(':id')
  public async findOne(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
  ): Promise<SpaceEntity> {
    const space = await this.spaceService.findOne({
      id,
      tenantId: user.tenantId,
      deletedAt: null,
      OR: [
        { visibility: Visibility.PUBLIC },
        {
          visibility: Visibility.PRIVATE,
          users: {
            some: { userId: user.id, status: MembershipStatus.ACTIVE },
          },
        },
      ],
    });

    return new SpaceEntity(space);
  }

  /**
   * 공간 수정
   *
   * @remarks 공간 정보를 수정합니다. 소유자(OWNER) 또는 관리자(MANAGER) 권한이 필요합니다.
   */
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
    @Body() updateSpaceDto: UpdateSpaceDto,
  ): Promise<SpaceEntity> {
    const space = await this.spaceService.update({
      where: {
        id,
        tenantId: user.tenantId,
        deletedAt: null,
        users: {
          some: {
            userId: user.id,
            status: MembershipStatus.ACTIVE,
            role: { in: [Role.OWNER, Role.MANAGER] },
          },
        },
      },
      data: updateSpaceDto,
    });

    return new SpaceEntity(space);
  }

  /**
   * 공간 삭제
   *
   * @remarks 공간을 삭제합니다(소프트 삭제). 소유자(OWNER) 또는 관리자(MANAGER) 권한이 필요합니다.
   */
  @Delete(':id')
  public async remove(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
  ): Promise<void> {
    await this.spaceService.remove({
      id,
      tenantId: user.tenantId,
      deletedAt: null,
      users: {
        some: {
          userId: user.id,
          status: MembershipStatus.ACTIVE,
          role: { in: [Role.OWNER, Role.MANAGER] },
        },
      },
    });
  }

  /**
   * 공간 가입
   *
   * @remarks 공개(PUBLIC) 공간에 본인을 멤버(ACTIVE)로 등록합니다. 비공개(PRIVATE) 공간은 초대를 통해서만 가입할 수 있습니다. 대기 중인 초대가 있다면 자동으로 수락 처리됩니다.
   */
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':id/join')
  public async join(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
  ): Promise<void> {
    const space = await this.spaceService.findOne({
      id,
      tenantId: user.tenantId,
      deletedAt: null,
    });

    if (space.visibility !== Visibility.PUBLIC) {
      throw new ForbiddenException(
        '비공개 공간은 초대를 통해서만 가입할 수 있습니다.',
      );
    }

    const existing = await this.dbService.spaceUser.findUnique({
      where: { spaceId_userId: { spaceId: id, userId: user.id } },
    });

    if (existing?.status === MembershipStatus.ACTIVE) {
      throw new BadRequestException('이미 가입한 공간입니다.');
    }

    if (existing?.status === MembershipStatus.PENDING) {
      await this.dbService.spaceUser.update({
        where: { id: existing.id },
        data: { status: MembershipStatus.ACTIVE },
      });

      return;
    }

    await this.dbService.spaceUser.create({
      data: {
        tenantId: user.tenantId,
        spaceId: id,
        userId: user.id,
        role: Role.MEMBER,
        status: MembershipStatus.ACTIVE,
      },
    });
  }

  /**
   * 공간 초대 생성
   *
   * @remarks 동일 테넌트의 다른 사용자를 공간으로 초대합니다. 소유자(OWNER) 또는 관리자(MANAGER) 권한이 필요합니다. 초대받은 사용자가 수락해야 멤버로 등록됩니다.
   */
  @Post(':id/invitations')
  public async createInvitation(
    @Param('id') id: string,
    @User() inviter: UserTokenPayload,
    @Body() { inviteeId }: InviteSpaceUserDto,
  ): Promise<SpaceUserEntity> {
    if (inviter.id === inviteeId) {
      throw new BadRequestException('본인을 초대할 수 없습니다.');
    }

    const space = await this.spaceService.findOne({
      id,
      tenantId: inviter.tenantId,
      deletedAt: null,
      users: {
        some: {
          userId: inviter.id,
          status: MembershipStatus.ACTIVE,
          role: { in: [Role.OWNER, Role.MANAGER] },
        },
      },
    });

    const invitee = await this.dbService.user.findFirst({
      where: { id: inviteeId, tenantId: inviter.tenantId, deletedAt: null },
    });

    if (!invitee) {
      throw new NotFoundException('초대 대상을 찾을 수 없습니다.');
    }

    const existing = await this.dbService.spaceUser.findUnique({
      where: { spaceId_userId: { spaceId: space.id, userId: inviteeId } },
    });

    if (existing?.status === MembershipStatus.ACTIVE) {
      throw new BadRequestException('이미 공간 멤버인 사용자입니다.');
    }

    if (existing?.status === MembershipStatus.PENDING) {
      throw new BadRequestException('이미 대기 중인 초대가 있습니다.');
    }

    const invitation = await this.dbService.spaceUser.create({
      data: {
        tenantId: inviter.tenantId,
        spaceId: space.id,
        userId: inviteeId,
        role: Role.MEMBER,
        status: MembershipStatus.PENDING,
      },
    });

    return new SpaceUserEntity(invitation);
  }

  /**
   * 공간 초대 목록 조회
   *
   * @remarks 해당 공간에 발송된 대기 중(PENDING) 초대 목록을 조회합니다. 소유자(OWNER) 또는 관리자(MANAGER) 권한이 필요합니다.
   */
  @Get(':id/invitations')
  public async findInvitations(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
  ): Promise<SpaceUserEntity[]> {
    const space = await this.spaceService.findOne({
      id,
      tenantId: user.tenantId,
      deletedAt: null,
      users: {
        some: {
          userId: user.id,
          status: MembershipStatus.ACTIVE,
          role: { in: [Role.OWNER, Role.MANAGER] },
        },
      },
    });

    const invitations = await this.dbService.spaceUser.findMany({
      where: { spaceId: space.id, status: MembershipStatus.PENDING },
      orderBy: { createdAt: 'desc' },
    });

    return invitations.map((invitation) => new SpaceUserEntity(invitation));
  }

  /**
   * 공간 초대 회수
   *
   * @remarks 대기 중인 공간 초대를 회수합니다(레코드 삭제). 소유자(OWNER) 또는 관리자(MANAGER) 권한이 필요합니다.
   */
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/invitations/:invitationId')
  public async revokeInvitation(
    @Param('id') id: string,
    @Param('invitationId') invitationId: string,
    @User() user: UserTokenPayload,
  ): Promise<void> {
    const space = await this.spaceService.findOne({
      id,
      tenantId: user.tenantId,
      deletedAt: null,
      users: {
        some: {
          userId: user.id,
          status: MembershipStatus.ACTIVE,
          role: { in: [Role.OWNER, Role.MANAGER] },
        },
      },
    });

    const invitation = await this.dbService.spaceUser.findFirst({
      where: { id: invitationId, spaceId: space.id },
    });

    if (!invitation) {
      throw new NotFoundException('초대를 찾을 수 없습니다.');
    }

    if (invitation.status !== MembershipStatus.PENDING) {
      throw new BadRequestException('대기 중인 초대만 회수할 수 있습니다.');
    }

    await this.dbService.spaceUser.delete({ where: { id: invitationId } });
  }
}
