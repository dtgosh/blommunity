import { PostService } from '@app/post';
import { CreatePostDto } from '@app/post/dto/create-post.dto';
import { FindAllPostsDto } from '@app/post/dto/find-all-posts.dto';
import { UpdatePostDto } from '@app/post/dto/update-post.dto';
import { PostDetailEntity } from '@app/post/entities/post-detail.entity';
import { PostListItemEntity } from '@app/post/entities/post-list-item.entity';
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

@SerializeOptions({ strategy: 'excludeAll' })
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostService) {}

  @Post()
  public create(
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostDetailEntity> {
    return this.postService.create(createPostDto);
  }

  @Get()
  public findAll(
    @Query() findAllPostsDto: FindAllPostsDto,
  ): Promise<PostListItemEntity[]> {
    return this.postService.findAll(findAllPostsDto);
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<PostDetailEntity> {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  public update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostDetailEntity> {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  public remove(@Param('id') id: string): Promise<void> {
    return this.postService.remove(+id);
  }
}
