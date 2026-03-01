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
  SerializeOptions,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/auth.interfaces';
import { Public } from '../auth/decorators/public.decorator';
import { User } from '../auth/decorators/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindAllPostsEntity } from './entities/find-all-posts.entity';
import { PostDetailEntity } from './entities/post-detail.entity';

@SerializeOptions({ strategy: 'excludeAll' })
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostService) {}

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

  @Public()
  @Get()
  public async findAll(
    @Query() findAllPostsDto: FindAllPostsDto,
  ): Promise<FindAllPostsEntity> {
    const result = await this.postService.findAll(findAllPostsDto);

    return new FindAllPostsEntity(result);
  }

  @Public()
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<PostDetailEntity> {
    const result = await this.postService.findOne(+id);

    return new PostDetailEntity(result);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @User() user: AuthenticatedUser,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostDetailEntity> {
    const result = await this.postService.update(+id, user.id, updatePostDto);

    return new PostDetailEntity(result);
  }

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
