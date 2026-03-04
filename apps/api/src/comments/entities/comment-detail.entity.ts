import type { CommentDetail } from '@app/comment/comment.interfaces';
import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CommentListItemEntity } from './comment-list-item.entity';

@ApiSchema({
  name: '댓글 상세 조회 결과',
  description: '댓글 상세 조회 응답에 포함되는 정보',
})
export class CommentDetailEntity extends CommentListItemEntity {
  /** 수정일시 */
  @Expose()
  public updatedAt!: Date;

  constructor(data: CommentDetail) {
    super(data);
  }
}
