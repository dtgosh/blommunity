import { PostAuthor } from '@app/post/post.interfaces';
import { Expose } from 'class-transformer';

export class PostAuthorEntity {
  @Expose()
  public id!: bigint;

  @Expose()
  public username!: string;

  constructor(data: PostAuthor) {
    Object.assign(this, data);
  }
}
