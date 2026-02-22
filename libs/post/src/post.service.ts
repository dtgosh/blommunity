import { DbService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { FindAllPostsDto } from './dto/find-all-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostDetailEntity } from './entities/post-detail.entity';
import { PostListItemEntity } from './entities/post-list-item.entity';

@Injectable()
export class PostService {
  private defaultFindPostDetailArgs = {
    omit: {
      isPublished: true,
      deletedAt: true,
      authorId: true,
      groupId: true,
    },
    include: { author: { select: { id: true, username: true } } },
  };

  constructor(private dbService: DbService) {}

  public async create(data: CreatePostDto): Promise<PostDetailEntity> {
    const result = await this.dbService.post.create({
      ...this.defaultFindPostDetailArgs,
      data,
    });

    return new PostDetailEntity(result);
  }

  public async findAll({
    id,
    authorId,
    groupId,
    skip = 1,
    take = 30,
  }: FindAllPostsDto): Promise<PostListItemEntity[]> {
    const results = await this.dbService.post.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        author: { select: { id: true, username: true } },
      },
      where: { authorId, groupId, isPublished: true, deletedAt: null },
      orderBy: { id: 'desc' },
      cursor: { id },
      skip,
      take,
    });

    return results.map((result) => new PostListItemEntity(result));
  }

  public async findOne(id: number): Promise<PostDetailEntity> {
    const result = await this.dbService.post.findUniqueOrThrow({
      ...this.defaultFindPostDetailArgs,
      where: { id, deletedAt: null },
    });

    return new PostDetailEntity(result);
  }

  public async update(
    id: number,
    data: UpdatePostDto,
  ): Promise<PostDetailEntity> {
    const result = await this.dbService.post.update({
      ...this.defaultFindPostDetailArgs,
      data,
      where: { id, deletedAt: null },
    });

    return new PostDetailEntity(result);
  }

  public async remove(id: number): Promise<void> {
    await this.dbService.post.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
