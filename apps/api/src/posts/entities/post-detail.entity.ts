import type { PostDetail } from '@app/post/post.interfaces';
import { Expose } from 'class-transformer';
import { PostListItemEntity } from './post-list-item.entity';
import { ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  name: '게시물 상세 조회 결과',
  description: '게시물 상세 조회 응답에 포함되는 정보',
})
export class PostDetailEntity extends PostListItemEntity {
  /** 게시물 본문 */
  @Expose()
  public content!: string | null;

  /** 수정일시 */
  @Expose()
  public updatedAt!: Date;

  constructor(data: PostDetail) {
    super(data);

    Object.assign(this, data);
  }
}
