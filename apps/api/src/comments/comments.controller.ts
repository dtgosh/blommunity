import { CommentService } from '@app/comment';
import { Serialize } from '@app/util/decorators/serialize.decorator';
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
import { Public, User } from '../auth/auth.decorators';
import type { AuthenticatedUser } from '../auth/auth.interfaces';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindAllCommentsDto } from './dto/find-all-comments.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentDetailEntity } from './entities/comment-detail.entity';
import { FindAllCommentsEntity } from './entities/find-all-comments.entity';

@ApiTags('댓글')
@Serialize()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 댓글 생성
   *
   * @remarks 새로운 댓글을 생성합니다. JWT 토큰 인증이 필요합니다.
   */
  @ApiBearerAuth()
  @Post()
  public async create(
    @User() user: AuthenticatedUser,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentDetailEntity> {
    const result = await this.commentService.create({
      authorId: user.id,
      ...createCommentDto,
    });

    return new CommentDetailEntity(result);
  }

  /**
   * 댓글 목록 조회
   *
   * @remarks 조건에 맞는 댓글 목록을 조회합니다. 인증 없이 접근 가능하며, 게시물·작성자 필터와 페이지네이션을 지원합니다.
   */
  @Public()
  @Get()
  public async findAll(
    @Query() findAllCommentsDto: FindAllCommentsDto,
  ): Promise<FindAllCommentsEntity> {
    const result = await this.commentService.findAll(findAllCommentsDto);

    return new FindAllCommentsEntity(result);
  }

  /**
   * 댓글 상세 조회
   *
   * @remarks 댓글의 상세 정보를 조회합니다. 인증 없이 접근 가능합니다.
   */
  @Public()
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<CommentDetailEntity> {
    const result = await this.commentService.findOne(BigInt(id));

    return new CommentDetailEntity(result);
  }

  /**
   * 댓글 수정
   *
   * @remarks 기존 댓글을 수정합니다. JWT 토큰 인증이 필요하며, 변경할 필드만 전달하면 됩니다.
   */
  @ApiBearerAuth()
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @User() user: AuthenticatedUser,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentDetailEntity> {
    const result = await this.commentService.update(
      BigInt(id),
      user.id,
      updateCommentDto,
    );

    return new CommentDetailEntity(result);
  }

  /**
   * 댓글 삭제
   *
   * @remarks 댓글을 삭제합니다. JWT 토큰 인증이 필요하며, 작성자 본인 또는 관리자만 삭제할 수 있습니다.
   */
  @ApiBearerAuth()
  @Delete(':id')
  public async remove(
    @User() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<void> {
    await this.commentService.remove({
      commentId: BigInt(id),
      accountRole: user.role,
      authorId: user.id,
    });
  }
}
