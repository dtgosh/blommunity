import { Expose } from 'class-transformer';
import { Post } from 'generated/prisma/client';
import { PostListItemEntity } from './post-list-item.entity';

export class PostDetailEntity extends PostListItemEntity {
  @Expose()
  public content!: string | null;

  @Expose()
  public updatedAt!: Date;

  constructor(partial: Partial<Post>) {
    super(partial);

    Object.assign(this, partial);
  }
}
