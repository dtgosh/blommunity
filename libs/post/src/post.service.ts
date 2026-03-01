import { DbService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { AccountRole } from 'generated/prisma/enums';
import {
  PostCreateArgs,
  PostFindUniqueOrThrowArgs,
  PostUpdateArgs,
} from 'generated/prisma/models';
import {
  FindAllPostsArgs,
  FindAllPostsResult,
  PostDetail,
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

  public async findAll({
    authorId,
    groupId,
    page = 1,
    size = 30,
  }: FindAllPostsArgs): Promise<FindAllPostsResult> {
    const where = { authorId, groupId, isPublished: true, deletedAt: null };

    const [totalCount, items] = await Promise.all([
      this.dbService.post.count({ where }),
      this.dbService.post.findMany({
        select: {
          id: true,
          title: true,
          createdAt: true,
          author: { select: { id: true, username: true } },
        },
        where,
        orderBy: { id: 'desc' },
        skip: (page - 1) * size,
        take: size,
      }),
    ]);

    return { totalCount, items };
  }

  public findOne(
    id: PostFindUniqueOrThrowArgs['where']['id'],
  ): Promise<PostDetail> {
    return this.dbService.post.findUniqueOrThrow({
      ...this.defaultFindPostDetailArgs,
      where: { id, deletedAt: null },
    });
  }

  public update(
    id: PostUpdateArgs['where']['id'],
    authorId: PostUpdateArgs['where']['authorId'],
    data: PostUpdateArgs['data'],
  ): Promise<PostDetail> {
    return this.dbService.post.update({
      ...this.defaultFindPostDetailArgs,
      data,
      where: { id, authorId, deletedAt: null },
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
        authorId: accountRole === AccountRole.USER ? authorId : undefined,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }
}
