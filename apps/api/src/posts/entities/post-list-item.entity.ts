import { Expose } from 'class-transformer';
import { PostAuthorEntity } from './post-author.entity';
import { PostListItem } from '@app/post/post.interfaces';

export class PostListItemEntity {
  @Expose()
  public id!: bigint;

  @Expose()
  public title!: string;

  @Expose()
  public createdAt!: Date;

  @Expose()
  public author!: PostAuthorEntity;

  constructor(data: PostListItem) {
    Object.assign(this, data);

    this.author = new PostAuthorEntity(data.author);
  }
}
