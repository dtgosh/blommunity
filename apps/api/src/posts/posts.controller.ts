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
import { CreatePostDto } from './dto/create-post.dto';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostDetailEntity } from './entities/post-detail.entity';
import { PostListItemEntity } from './entities/post-list-item.entity';

@SerializeOptions({ strategy: 'excludeAll' })
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostService) {}

  @Post()
  public async create(
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostDetailEntity> {
    const result = await this.postService.create(createPostDto);

    return new PostDetailEntity(result);
  }

  @Get()
  public async findAll(
    @Query() findAllPostsDto: FindAllPostsDto,
  ): Promise<PostListItemEntity[]> {
    const result = await this.postService.findAll(findAllPostsDto);

    return result.map((item) => new PostListItemEntity(item));
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<PostDetailEntity> {
    const result = await this.postService.findOne(+id);

    return new PostDetailEntity(result);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostDetailEntity> {
    const result = await this.postService.update(+id, updatePostDto);

    return new PostDetailEntity(result);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    await this.postService.remove(+id);
  }
}
