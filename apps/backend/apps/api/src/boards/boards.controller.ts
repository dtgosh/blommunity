import { User } from '../auth/auth.decorators';
import type { UserTokenPayload } from '../auth/auth.interfaces';
import { BoardService } from '@app/board';
import { DbService, MembershipStatus, Role, Visibility } from '@app/db';
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
import { SpaceService } from '@app/space';
import { Serialize } from '../api.decorators';
import { CreateBoardDto } from './dto/create-board.dto';
import { InviteBoardUserDto } from './dto/invite-board-user.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardUserEntity } from './entities/board-user.entity';
import { BoardEntity } from './entities/board.entity';

@ApiTags('게시판')
@ApiBearerAuth()
@Serialize()
@Controller('boards')
export class BoardsController {
  constructor(
    private readonly boardService: BoardService,
    private readonly spaceService: SpaceService,
    private readonly dbService: DbService,
  ) {}

  /**
   * 게시판 생성
   *
   * @remarks 공간 내에 새로운 게시판을 생성합니다. 생성한 사용자가 소유자(OWNER)로 등록됩니다. 비공개(PRIVATE) 공간이라면 해당 공간의 멤버여야 생성할 수 있습니다.
   */
  @Post()
  public async create(
    @User() { tenantId, id }: UserTokenPayload,
    @Body() createBoardDto: CreateBoardDto,
  ): Promise<BoardEntity> {
    await this.spaceService.findOne({
      id: createBoardDto.spaceId,
      tenantId,
      deletedAt: null,
      OR: [
        { visibility: Visibility.PUBLIC },
        {
          visibility: Visibility.PRIVATE,
          users: { some: { userId: id, status: MembershipStatus.ACTIVE } },
        },
      ],
    });

    const board = await this.boardService.create({
      ...createBoardDto,
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

    return new BoardEntity(board);
  }

  /**
   * 게시판 목록 조회
   *
   * @remarks 접근 가능한 게시판 목록을 조회합니다. 공개(PUBLIC) 게시판과 본인이 멤버(ACTIVE)인 비공개(PRIVATE) 게시판이 반환됩니다. 비공개(PRIVATE) 공간의 게시판은 해당 공간의 멤버에게만 노출됩니다.
   */
  @Get()
  public async findAll(@User() user: UserTokenPayload): Promise<BoardEntity[]> {
    const boards = await this.boardService.findAll({
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
      space: {
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
      },
    });

    return boards.map((board) => new BoardEntity(board));
  }

  /**
   * 내 게시판 초대 목록 조회
   *
   * @remarks 본인이 받은 대기 중(PENDING) 게시판 초대 목록을 조회합니다.
   */
  @Get('invitations/me')
  public async findMyInvitations(
    @User() user: UserTokenPayload,
  ): Promise<BoardUserEntity[]> {
    const invitations = await this.dbService.boardUser.findMany({
      where: {
        tenantId: user.tenantId,
        userId: user.id,
        status: MembershipStatus.PENDING,
      },
      orderBy: { createdAt: 'desc' },
    });

    return invitations.map((invitation) => new BoardUserEntity(invitation));
  }

  /**
   * 게시판 초대 수락
   *
   * @remarks 본인에게 발송된 대기 중 게시판 초대를 수락하고 해당 게시판의 멤버(ACTIVE)로 등록됩니다.
   */
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('invitations/:invitationId/accept')
  public async acceptInvitation(
    @User() user: UserTokenPayload,
    @Param('invitationId') invitationId: string,
  ): Promise<void> {
    const invitation = await this.dbService.boardUser.findFirst({
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

    await this.dbService.boardUser.update({
      where: { id: invitationId },
      data: { status: MembershipStatus.ACTIVE },
    });
  }

  /**
   * 게시판 초대 거절
   *
   * @remarks 본인에게 발송된 대기 중 게시판 초대를 거절합니다. 초대 레코드가 삭제됩니다.
   */
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('invitations/:invitationId/decline')
  public async declineInvitation(
    @User() user: UserTokenPayload,
    @Param('invitationId') invitationId: string,
  ): Promise<void> {
    const invitation = await this.dbService.boardUser.findFirst({
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

    await this.dbService.boardUser.delete({ where: { id: invitationId } });
  }

  /**
   * 게시판 상세 조회
   *
   * @remarks ID로 단일 게시판을 조회합니다. 접근 권한이 없는 비공개 게시판이나, 접근 권한이 없는 비공개(PRIVATE) 공간에 속한 게시판은 조회되지 않습니다.
   */
  @Get(':id')
  public async findOne(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
  ): Promise<BoardEntity> {
    const board = await this.boardService.findOne({
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
      space: {
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
      },
    });

    return new BoardEntity(board);
  }

  /**
   * 게시판 수정
   *
   * @remarks 게시판 정보를 수정합니다. 소유자(OWNER) 또는 관리자(MANAGER) 권한이 필요합니다.
   */
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<BoardEntity> {
    const board = await this.boardService.update({
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
      data: updateBoardDto,
    });

    return new BoardEntity(board);
  }

  /**
   * 게시판 삭제
   *
   * @remarks 게시판을 삭제합니다(소프트 삭제). 소유자(OWNER) 또는 관리자(MANAGER) 권한이 필요합니다.
   */
  @Delete(':id')
  public async remove(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
  ): Promise<void> {
    await this.boardService.remove({
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
   * 게시판 가입
   *
   * @remarks 공개(PUBLIC) 게시판에 본인을 멤버(ACTIVE)로 등록합니다. 비공개(PRIVATE) 게시판은 초대를 통해서만 가입할 수 있으며, 비공개(PRIVATE) 공간의 게시판은 해당 공간의 멤버여야 합니다. 대기 중인 초대가 있다면 자동으로 수락 처리됩니다.
   */
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':id/join')
  public async join(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
  ): Promise<void> {
    const board = await this.boardService.findOne({
      id,
      tenantId: user.tenantId,
      deletedAt: null,
      space: {
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
      },
    });

    if (board.visibility !== Visibility.PUBLIC) {
      throw new ForbiddenException(
        '비공개 게시판은 초대를 통해서만 가입할 수 있습니다.',
      );
    }

    const existing = await this.dbService.boardUser.findUnique({
      where: { boardId_userId: { boardId: id, userId: user.id } },
    });

    if (existing?.status === MembershipStatus.ACTIVE) {
      throw new BadRequestException('이미 가입한 게시판입니다.');
    }

    if (existing?.status === MembershipStatus.PENDING) {
      await this.dbService.boardUser.update({
        where: { id: existing.id },
        data: { status: MembershipStatus.ACTIVE },
      });

      return;
    }

    await this.dbService.boardUser.create({
      data: {
        tenantId: user.tenantId,
        boardId: id,
        userId: user.id,
        role: Role.MEMBER,
        status: MembershipStatus.ACTIVE,
      },
    });
  }

  /**
   * 게시판 초대 생성
   *
   * @remarks 동일 테넌트의 다른 사용자를 게시판으로 초대합니다. 소유자(OWNER) 또는 관리자(MANAGER) 권한이 필요합니다. 초대받은 사용자가 수락해야 멤버로 등록됩니다.
   */
  @Post(':id/invitations')
  public async createInvitation(
    @Param('id') id: string,
    @User() inviter: UserTokenPayload,
    @Body() { inviteeId }: InviteBoardUserDto,
  ): Promise<BoardUserEntity> {
    if (inviter.id === inviteeId) {
      throw new BadRequestException('본인을 초대할 수 없습니다.');
    }

    const board = await this.boardService.findOne({
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

    const existing = await this.dbService.boardUser.findUnique({
      where: { boardId_userId: { boardId: board.id, userId: inviteeId } },
    });

    if (existing?.status === MembershipStatus.ACTIVE) {
      throw new BadRequestException('이미 게시판 멤버인 사용자입니다.');
    }

    if (existing?.status === MembershipStatus.PENDING) {
      throw new BadRequestException('이미 대기 중인 초대가 있습니다.');
    }

    const invitation = await this.dbService.boardUser.create({
      data: {
        tenantId: inviter.tenantId,
        boardId: board.id,
        userId: inviteeId,
        role: Role.MEMBER,
        status: MembershipStatus.PENDING,
      },
    });

    return new BoardUserEntity(invitation);
  }

  /**
   * 게시판 초대 목록 조회
   *
   * @remarks 해당 게시판에 발송된 대기 중(PENDING) 초대 목록을 조회합니다. 소유자(OWNER) 또는 관리자(MANAGER) 권한이 필요합니다.
   */
  @Get(':id/invitations')
  public async findInvitations(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
  ): Promise<BoardUserEntity[]> {
    const board = await this.boardService.findOne({
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

    const invitations = await this.dbService.boardUser.findMany({
      where: { boardId: board.id, status: MembershipStatus.PENDING },
      orderBy: { createdAt: 'desc' },
    });

    return invitations.map((invitation) => new BoardUserEntity(invitation));
  }

  /**
   * 게시판 초대 회수
   *
   * @remarks 대기 중인 게시판 초대를 회수합니다(레코드 삭제). 소유자(OWNER) 또는 관리자(MANAGER) 권한이 필요합니다.
   */
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/invitations/:invitationId')
  public async revokeInvitation(
    @Param('id') id: string,
    @Param('invitationId') invitationId: string,
    @User() user: UserTokenPayload,
  ): Promise<void> {
    const board = await this.boardService.findOne({
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

    const invitation = await this.dbService.boardUser.findFirst({
      where: { id: invitationId, boardId: board.id },
    });

    if (!invitation) {
      throw new NotFoundException('초대를 찾을 수 없습니다.');
    }

    if (invitation.status !== MembershipStatus.PENDING) {
      throw new BadRequestException('대기 중인 초대만 회수할 수 있습니다.');
    }

    await this.dbService.boardUser.delete({ where: { id: invitationId } });
  }
}
