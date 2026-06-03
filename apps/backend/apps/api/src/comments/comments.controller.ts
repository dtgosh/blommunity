import { User } from '../auth/auth.decorators';
import type { UserTokenPayload } from '../auth/auth.interfaces';
import { CommentService } from '@app/comment';
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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize } from '../api.decorators';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ListCommentsQueryDto } from './dto/list-comments-query.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@ApiTags('댓글')
@ApiBearerAuth()
@Serialize()
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentService: CommentService,
    private readonly postService: PostService,
  ) {}

  /**
   * 댓글 작성
   *
   * @remarks 게시물에 댓글을 작성합니다. 상위 댓글 ID를 지정하면 대댓글로 등록됩니다. 비공개(PRIVATE) 공간 또는 게시판이라면 멤버여야 작성할 수 있습니다.
   */
  @Post()
  public async create(
    @User() { tenantId, id }: UserTokenPayload,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    await this.postService.findOne({
      id: createCommentDto.postId,
      tenantId,
      deletedAt: null,
      board: {
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
      },
    });

    const comment = await this.commentService.create({
      ...createCommentDto,
      tenantId,
      authorId: id,
    });

    return new CommentEntity(comment);
  }

  /**
   * 댓글 목록 조회
   *
   * @remarks 게시물에 속한 댓글 목록을 조회합니다. `parentId`를 지정하지 않으면 해당 게시물의 최상위 댓글을, 지정하면 해당 댓글의 대댓글을 반환합니다. 비공개(PRIVATE) 공간 또는 게시판에 속한 댓글은 해당 공간/게시판의 멤버에게만 노출됩니다.
   */
  @Get()
  public async findAll(
    @User() user: UserTokenPayload,
    @Query() { postId, parentId }: ListCommentsQueryDto,
  ): Promise<CommentEntity[]> {
    const comments = await this.commentService.findAll({
      tenantId: user.tenantId,
      deletedAt: null,
      postId,
      parentId: parentId ?? null,
      post: {
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
      },
    });

    return comments.map((comment) => new CommentEntity(comment));
  }

  /**
   * 댓글 상세 조회
   *
   * @remarks ID로 단일 댓글을 조회합니다. 접근 권한이 없는 비공개(PRIVATE) 공간/게시판의 댓글은 조회되지 않습니다.
   */
  @Get(':id')
  public async findOne(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
  ): Promise<CommentEntity> {
    const comment = await this.commentService.findOne({
      id,
      tenantId: user.tenantId,
      deletedAt: null,
      post: {
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
      },
    });

    return new CommentEntity(comment);
  }

  /**
   * 댓글 수정
   *
   * @remarks 댓글을 수정합니다. 본인이 작성한 댓글만 수정할 수 있습니다.
   */
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentEntity> {
    const comment = await this.commentService.update({
      where: {
        id,
        tenantId: user.tenantId,
        authorId: user.id,
        deletedAt: null,
      },
      data: updateCommentDto,
    });

    return new CommentEntity(comment);
  }

  /**
   * 댓글 삭제
   *
   * @remarks 댓글을 삭제합니다(소프트 삭제). 작성자 본인이거나, 해당 게시판의 소유자(OWNER)/관리자(MANAGER)만 삭제할 수 있습니다.
   */
  @Delete(':id')
  public async remove(
    @Param('id') id: string,
    @User() user: UserTokenPayload,
  ): Promise<void> {
    await this.commentService.remove({
      id,
      tenantId: user.tenantId,
      deletedAt: null,
      OR: [
        { authorId: user.id },
        {
          post: {
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
        },
      ],
    });
  }
}
