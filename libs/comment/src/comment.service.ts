import { DbService } from '@app/db';
import { Injectable } from '@nestjs/common';
import { AccountRole } from 'generated/prisma/enums';
import {
  CommentCreateArgs,
  CommentFindUniqueOrThrowArgs,
  CommentUpdateArgs,
} from 'generated/prisma/models';
import {
  CommentDetail,
  FindAllCommentsArgs,
  FindAllCommentsResult,
  RemoveCommentArgs,
} from './comment.interfaces';

@Injectable()
export class CommentService {
  private readonly defaultFindCommentDetailArgs = {
    omit: {
      deletedAt: true,
      authorId: true,
    },
    include: { author: { select: { id: true, username: true } } },
  };

  constructor(private dbService: DbService) {}

  public create(data: CommentCreateArgs['data']): Promise<CommentDetail> {
    return this.dbService.comment.create({
      ...this.defaultFindCommentDetailArgs,
      data,
    });
  }

  public async findAll({
    postId,
    authorId,
    page = 1,
    size = 30,
  }: FindAllCommentsArgs): Promise<FindAllCommentsResult> {
    const where = { postId, authorId, deletedAt: null };

    const [totalCount, items] = await Promise.all([
      this.dbService.comment.count({ where }),
      this.dbService.comment.findMany({
        select: {
          id: true,
          postId: true,
          parentCommentId: true,
          content: true,
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
    id: CommentFindUniqueOrThrowArgs['where']['id'],
  ): Promise<CommentDetail> {
    return this.dbService.comment.findUniqueOrThrow({
      ...this.defaultFindCommentDetailArgs,
      where: { id, deletedAt: null },
    });
  }

  public update(
    id: CommentUpdateArgs['where']['id'],
    authorId: CommentUpdateArgs['where']['authorId'],
    data: CommentUpdateArgs['data'],
  ): Promise<CommentDetail> {
    return this.dbService.comment.update({
      ...this.defaultFindCommentDetailArgs,
      where: { id, authorId, deletedAt: null },
      data,
    });
  }

  public async remove({
    commentId,
    accountRole,
    authorId,
  }: RemoveCommentArgs): Promise<void> {
    const data = { deletedAt: new Date() };
    const where = { deletedAt: null };

    const { childComments } = await this.dbService.comment.update({
      select: {
        childComments: {
          where,
          select: { childComments: { select: { id: true } } },
        },
      },
      data: { ...data, childComments: { updateMany: { where, data } } },
      where: {
        id: commentId,
        authorId: accountRole === AccountRole.USER ? authorId : undefined,
        ...where,
      },
    });

    for (const childComment of childComments) {
      for (const { id } of childComment.childComments) {
        await this.remove({ commentId: id, accountRole, authorId });
      }
    }
  }
}
