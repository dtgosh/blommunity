import type { CommentListItem } from '@app/comment/comment.interfaces';
import { BigIntId } from '@app/util/decorators/bigint-id.decorator';
import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CommentAuthorEntity } from './comment-author.entity';

@ApiSchema({
  name: '댓글 요약 정보',
  description: '댓글 목록 응답에 포함되는 개별 항목 정보',
})
export class CommentListItemEntity {
  /** 댓글 ID */
  @Expose()
  @BigIntId()
  public id!: string;

  /** 게시물 ID */
  @Expose()
  @BigIntId()
  public postId!: string;

  /** 상위 댓글 ID */
  @Expose()
  @BigIntId()
  public parentCommentId!: string | null;

  /** 댓글 내용 */
  @Expose()
  public content!: string;

  /** 작성일시 */
  @Expose()
  public createdAt!: Date;

  /** 작성자 정보 */
  @Expose()
  public author!: CommentAuthorEntity;

  constructor(data: CommentListItem) {
    Object.assign(this, data);

    this.author = new CommentAuthorEntity(data.author);
  }
}
