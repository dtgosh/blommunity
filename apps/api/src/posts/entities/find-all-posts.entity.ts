import { FindAllPostsResult } from '@app/post/post.interfaces';
import { Expose } from 'class-transformer';
import { PostListItemEntity } from './post-list-item.entity';

export class FindAllPostsEntity {
  @Expose()
  public totalCount!: number;

  @Expose()
  public items!: PostListItemEntity[];

  constructor(data: FindAllPostsResult) {
    this.totalCount = data.totalCount;
    this.items = data.items.map((item) => new PostListItemEntity(item));
  }
}
