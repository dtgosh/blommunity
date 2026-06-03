import {
  Comment,
  CommentCreateArgs,
  CommentFindManyArgs,
  CommentFindUniqueOrThrowArgs,
  CommentUpdateArgs,
  DbService,
} from '@app/db';
import { Injectable } from '@nestjs/common';
import type { Prisma } from '@app/db';

@Injectable()
export class CommentService {
  constructor(private readonly dbService: DbService) {}

  public create(data: CommentCreateArgs['data']): Promise<Comment> {
    return this.dbService.$transaction(async (tx) => {
      const comment = await tx.comment.create({ data });

      await tx.post.update({
        where: { id: comment.postId },
        data: { commentCount: { increment: 1 } },
      });

      await this.walkAncestors(tx, comment.parentId, 1);

      return comment;
    });
  }

  public findAll(where: CommentFindManyArgs['where']): Promise<Comment[]> {
    return this.dbService.comment.findMany({ where });
  }

  public findOne(
    where: CommentFindUniqueOrThrowArgs['where'],
  ): Promise<Comment> {
    return this.dbService.comment.findUniqueOrThrow({ where });
  }

  public update(args: CommentUpdateArgs): Promise<Comment> {
    return this.dbService.comment.update(args);
  }

  public async remove(where: CommentUpdateArgs['where']): Promise<void> {
    await this.dbService.$transaction(async (tx) => {
      const comment = await tx.comment.update({
        where,
        data: { deletedAt: new Date() },
      });

      await tx.post.update({
        where: { id: comment.postId },
        data: { commentCount: { decrement: 1 } },
      });

      await this.walkAncestors(tx, comment.parentId, -1);
    });
  }

  private async walkAncestors(
    tx: Prisma.TransactionClient,
    startId: string | null,
    delta: number,
  ): Promise<void> {
    let currentId = startId;

    while (currentId) {
      const ancestor = await tx.comment.update({
        where: { id: currentId },
        data: { replyCount: { increment: delta } },
      });

      currentId = ancestor.parentId;
    }
  }
}
