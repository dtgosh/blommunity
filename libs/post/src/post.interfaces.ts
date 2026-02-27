interface PostAuthor {
  id: bigint;
  username: string;
}

export interface PostDetail {
  id: bigint;
  title: string;
  content: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: PostAuthor;
}

export interface PostListItem {
  id: bigint;
  title: string;
  createdAt: Date;
  author: PostAuthor;
}

export interface FindAllPostsArgs {
  id?: number;
  authorId?: number;
  groupId?: number;
  skip?: number;
  take?: number;
}
