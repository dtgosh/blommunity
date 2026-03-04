import { Account, Comment } from 'generated/prisma/client';
import {
  CommentFindManyArgs,
  CommentUpdateArgs,
} from 'generated/prisma/models';

export type CommentAuthor = Pick<Account, 'id' | 'username'>;

export interface CommentDetail extends Omit<Comment, 'deletedAt' | 'authorId'> {
  author: CommentAuthor;
}

export interface CommentListItem extends Pick<
  Comment,
  'id' | 'postId' | 'parentCommentId' | 'content' | 'createdAt'
> {
  author: CommentAuthor;
}

export interface FindAllCommentsArgs {
  postId?: NonNullable<CommentFindManyArgs['where']>['postId'];
  authorId?: NonNullable<CommentFindManyArgs['where']>['authorId'];
  page?: number;
  size?: number;
}

export interface RemoveCommentArgs {
  commentId: CommentUpdateArgs['where']['id'];
  accountRole: Account['role'];
  authorId: CommentUpdateArgs['where']['authorId'];
}

export interface FindAllCommentsResult {
  totalCount: number;
  items: CommentListItem[];
}
