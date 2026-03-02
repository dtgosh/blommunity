import type { PostListItem } from '@app/post/post.interfaces';
import { BigIntId } from '@app/util/decorators/bigint-id.decorator';
import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PostAuthorEntity } from './post-author.entity';

@ApiSchema({
  name: '게시물 요약 정보',
  description: '게시물 목록 응답에 포함되는 개별 항목 정보',
})
export class PostListItemEntity {
  /** 게시물 ID */
  @Expose()
  @BigIntId()
  public id!: string;

  /** 게시물 제목 */
  @Expose()
  public title!: string;

  /** 작성일시 */
  @Expose()
  public createdAt!: Date;

  /** 작성자 정보 */
  @Expose()
  public author!: PostAuthorEntity;

  constructor(data: PostListItem) {
    Object.assign(this, data);

    this.author = new PostAuthorEntity(data.author);
  }
}
