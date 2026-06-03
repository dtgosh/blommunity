import { User } from '../auth/auth.decorators';
import type { UserTokenPayload } from '../auth/auth.interfaces';
import { BoardService } from '@app/board';
import { MembershipStatus, Role, Visibility } from '@app/db';
import { PostService } from '@app/post';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize } from '../api.decorators';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';

@ApiTags('게시물')
@ApiBearerAuth()
@Serialize()
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postService: PostService,
    private readonly boardService: BoardService,
  ) {}

  /**
   * 게시물 작성
   *
   * @remarks 게시판에 새로운 게시물을 작성합니다. 요청한 사용자가 작성자로 등록됩니다. 비공개(PRIVATE) 공간 또는 게시판이라면 멤버여야 작성할 수 있습니다.
   */
  @Post()
  public async create(
    @User() { tenantId, id }: UserTokenPayload,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    await this.boardService.findOne({
      id: createPostDto.boardId,
      tenantId,
      deletedAt: null,
      OR: [
        { visibility: Visibility.PUBLIC },
        {
          visibility: Visibility.PRIVATE,
          users: { some: { userId: id, status: MembershipStatus.ACTIVE } },
        },
      ],
      space: {
        deletedAt: null,
        OR: [
          { visibility: Visibility.PUBLIC },
          {
            visibility: Visibility.PRIVATE,
            users: { some: { userId: id, status: MembershipStatus.ACTIVE } },
          },
        ],
      },
    });

    const post = await this.postService.create({
      ...createPostDto,
      tenantId,
      authorId: id,
    });

    return new PostEntity(post);
  }

  /**
   * 게시물 목록 조회
   *
   * @remarks 접근 가능한 게시물 목록을 조회합니다. 비공개(PRIVATE) 공간 또는 게시판에 속한 게시물은 해당 공간/게시판의 멤버에게만 노출됩니다.
   */
  @Get()
  public async findAll(@User() user: UserTokenPayload): Promise<PostEntity[]> {
    const posts = await this.postService.findAll({
      tenantId: user.tenantId,
      deletedAt: null,
      board: {
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
      },
    });

    return posts.map((post) => new PostEntity(post));
  }

  /**
   * 게시물 상세 조회
   *
   * @remarks ID로 단일 게시물을 조회합니다. 접근 권한이 없는 비공개(PRIVATE) 공간/게시판에 속한 게시물은 조회되지 않습니다.
   */
  @Get(':id')
  public async findOne(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
  ): Promise<PostEntity> {
    const post = await this.postService.findOne({
      id,
      tenantId: user.tenantId,
      deletedAt: null,
      board: {
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
      },
    });

    return new PostEntity(post);
  }

  /**
   * 게시물 수정
   *
   * @remarks 게시물을 수정합니다. 본인이 작성한 게시물만 수정할 수 있습니다.
   */
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    const post = await this.postService.update({
      where: {
        id,
        tenantId: user.tenantId,
        authorId: user.id,
        deletedAt: null,
      },
      data: updatePostDto,
    });

    return new PostEntity(post);
  }

  /**
   * 게시물 삭제
   *
   * @remarks 게시물을 삭제합니다(소프트 삭제). 작성자 본인이거나, 해당 게시판의 소유자(OWNER)/관리자(MANAGER)만 삭제할 수 있습니다.
   */
  @Delete(':id')
  public async remove(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
  ): Promise<void> {
    await this.postService.remove({
      id,
      tenantId: user.tenantId,
      deletedAt: null,
      OR: [
        { authorId: user.id },
        {
          board: {
            users: {
              some: {
                userId: user.id,
                status: MembershipStatus.ACTIVE,
                role: { in: [Role.OWNER, Role.MANAGER] },
              },
            },
          },
        },
      ],
    });
  }
}
