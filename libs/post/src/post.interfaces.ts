import { Account, Post } from 'generated/prisma/client';
import { PostUpdateArgs } from 'generated/prisma/models';

export type PostAuthor = Pick<Account, 'id' | 'username'>;

export interface PostDetail extends Omit<
  Post,
  'isPublished' | 'deletedAt' | 'authorId' | 'groupId'
> {
  author: PostAuthor;
}

export interface PostListItem extends Pick<Post, 'id' | 'title' | 'createdAt'> {
  author: PostAuthor;
}

export interface FindAllPostsArgs {
  authorId?: number;
  groupId?: number;
  page?: number;
  size?: number;
}

export interface RemovePostArgs {
  postId: PostUpdateArgs['where']['id'];
  accountRole: Account['role'];
  authorId: PostUpdateArgs['where']['authorId'];
}

export interface FindAllPostsResult {
  totalCount: number;
  items: PostListItem[];
}
