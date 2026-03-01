import { PostService } from '@app/post';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '../auth/auth.interfaces';
import { Public } from '../auth/decorators/public.decorator';
import { User } from '../auth/decorators/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsEntity } from './entities/find-all-posts.entity';
import { PostDetailEntity } from './entities/post-detail.entity';

@ApiTags('게시물')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostService) {}

  /**
   * 게시물 생성
   *
   * @remarks 새로운 게시물을 생성합니다. JWT 토큰 인증이 필요합니다.
   */
  @ApiBearerAuth()
  @Post()
  public async create(
    @User() user: AuthenticatedUser,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostDetailEntity> {
    const result = await this.postService.create({
      authorId: user.id,
      ...createPostDto,
    });

    return new PostDetailEntity(result);
  }

  /**
   * 게시물 목록 조회
   *
   * @remarks 조건에 맞는 게시물 목록을 조회합니다. 인증 없이 접근 가능하며, 작성자·그룹 필터와 페이지네이션을 지원합니다.
   */
  @Public()
  @Get()
  public async findAll(
    @Query() findAllPostsDto: FindAllPostsDto,
  ): Promise<FindAllPostsEntity> {
    const result = await this.postService.findAll(findAllPostsDto);

    return new FindAllPostsEntity(result);
  }

  /**
   * 게시물 상세 조회
   *
   * @remarks 게시물의 본문과 수정일시를 포함한 상세 정보를 조회합니다. 인증 없이 접근 가능합니다.
   */
  @Public()
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<PostDetailEntity> {
    const result = await this.postService.findOne(+id);

    return new PostDetailEntity(result);
  }

  /**
   * 게시물 수정
   *
   * @remarks 기존 게시물을 수정합니다. JWT 토큰 인증이 필요하며, 변경할 필드만 전달하면 됩니다.
   */
  @ApiBearerAuth()
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @User() user: AuthenticatedUser,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostDetailEntity> {
    const result = await this.postService.update(+id, user.id, updatePostDto);

    return new PostDetailEntity(result);
  }

  /**
   * 게시물 삭제
   *
   * @remarks 게시물을 삭제합니다. JWT 토큰 인증이 필요하며, 작성자 본인 또는 관리자만 삭제할 수 있습니다.
   */
  @ApiBearerAuth()
  @Delete(':id')
  public async remove(
    @User() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<void> {
    await this.postService.remove({
      postId: BigInt(id),
      accountRole: user.role,
      authorId: user.id,
    });
  }
}
