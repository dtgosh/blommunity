import { DbService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { AccountRole } from 'generated/prisma/enums';
import { PostCreateArgs, PostUpdateArgs } from 'generated/prisma/models';
import {
  FindAllPostsArgs,
  PostDetail,
  PostListItem,
  RemovePostArgs,
} from './post.interfaces';

@Injectable()
export class PostService {
  private readonly defaultFindPostDetailArgs = {
    omit: {
      isPublished: true,
      deletedAt: true,
      authorId: true,
      groupId: true,
    },
    include: { author: { select: { id: true, username: true } } },
  };

  constructor(private dbService: DbService) {}

  public create(data: PostCreateArgs['data']): Promise<PostDetail> {
    return this.dbService.post.create({
      ...this.defaultFindPostDetailArgs,
      data,
    });
  }

  public findAll({
    id,
    authorId,
    groupId,
    skip = 1,
    take = 30,
  }: FindAllPostsArgs): Promise<PostListItem[]> {
    return this.dbService.post.findMany({
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
  }

  public findOne(id: number): Promise<PostDetail> {
    return this.dbService.post.findUniqueOrThrow({
      ...this.defaultFindPostDetailArgs,
      where: { id, deletedAt: null },
    });
  }

  public update(id: number, data: PostUpdateArgs['data']): Promise<PostDetail> {
    return this.dbService.post.update({
      ...this.defaultFindPostDetailArgs,
      data,
      where: { id, deletedAt: null },
    });
  }

  public async remove({
    postId,
    accountRole,
    authorId,
  }: RemovePostArgs): Promise<void> {
    await this.dbService.post.update({
      where: {
        id: postId,
        authorId:
          accountRole === AccountRole.USER ? BigInt(authorId) : undefined,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }
}
