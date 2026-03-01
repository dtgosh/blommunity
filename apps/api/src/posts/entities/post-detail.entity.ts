import { PostDetail } from '@app/post/post.interfaces';
import { Expose } from 'class-transformer';
import { PostListItemEntity } from './post-list-item.entity';

export class PostDetailEntity extends PostListItemEntity {
  @Expose()
  public content!: string | null;

  @Expose()
  public updatedAt!: Date;

  constructor(data: PostDetail) {
    super(data);

    Object.assign(this, data);
  }
}
