import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import type { Comment } from '@app/db';

@ApiSchema({
  description: '게시물에 속한 댓글의 상세 정보',
})
export class CommentEntity {
  /** 댓글 ID */
  @Expose()
  public id!: string;

  /** 소속 게시물 ID */
  @Expose()
  public postId!: string;

  /** 상위 댓글 ID */
  @Expose()
  public parentId!: string | null;

  /** 작성자 ID */
  @Expose()
  public authorId!: string;

  /** 댓글 내용 */
  @Expose()
  public content!: string;

  /** 활성 대댓글 수 (모든 depth 포함) */
  @Expose()
  public replyCount!: number;

  /** 작성일시 */
  @Expose()
  public createdAt!: Date;

  /** 수정일시 */
  @Expose()
  public updatedAt!: Date;

  constructor(data: Partial<Comment>) {
    Object.assign(this, data);
  }
}
