import type { FindAllPostsResult } from '@app/post/post.interfaces';
import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PostListItemEntity } from './post-list-item.entity';

@ApiSchema({
  name: '게시물 목록 조회 결과',
  description: '게시물 목록 조회 응답에 포함되는 결과',
})
export class FindAllPostsEntity {
  /** 전체 게시물 수 */
  @Expose()
  public totalCount!: number;

  /** 게시물 목록 */
  @Expose()
  public items!: PostListItemEntity[];

  constructor(data: FindAllPostsResult) {
    this.totalCount = data.totalCount;
    this.items = data.items.map((item) => new PostListItemEntity(item));
  }
}
