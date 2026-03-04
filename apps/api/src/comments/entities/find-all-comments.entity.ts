import type { FindAllCommentsResult } from '@app/comment/comment.interfaces';
import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CommentListItemEntity } from './comment-list-item.entity';

@ApiSchema({
  name: '댓글 목록 조회 결과',
  description: '댓글 목록 조회 응답에 포함되는 결과',
})
export class FindAllCommentsEntity {
  /** 전체 댓글 수 */
  @Expose()
  public totalCount!: number;

  /** 댓글 목록 */
  @Expose()
  public items!: CommentListItemEntity[];

  constructor(data: FindAllCommentsResult) {
    this.totalCount = data.totalCount;
    this.items = data.items.map((item) => new CommentListItemEntity(item));
  }
}
