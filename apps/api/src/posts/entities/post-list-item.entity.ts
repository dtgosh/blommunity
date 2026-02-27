import { Post } from '@app/db/generated/client';
import { Expose, Transform } from 'class-transformer';
import { PostAuthorEntity } from './post-author.entity';

export class PostListItemEntity {
  @Expose()
  public id!: bigint;

  @Expose()
  public title!: string;

  @Expose()
  public createdAt!: Date;

  @Expose()
  @Transform(
    ({ value }: { value: Partial<PostAuthorEntity> }) =>
      new PostAuthorEntity(value),
  )
  public author!: PostAuthorEntity;

  constructor(partial: Partial<Post>) {
    Object.assign(this, partial);
  }
}
