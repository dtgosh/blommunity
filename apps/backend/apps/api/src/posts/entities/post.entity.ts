import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import type { Post } from '@app/db';

@ApiSchema({
  description: '게시판에 속한 게시물의 상세 정보',
})
export class PostEntity {
  /** 게시물 ID */
  @Expose()
  public id!: string;

  /** 소속 게시판 ID */
  @Expose()
  public boardId!: string;

  /** 작성자 ID */
  @Expose()
  public authorId!: string;

  /** 게시물 제목 */
  @Expose()
  public title!: string;

  /** 게시물 본문 */
  @Expose()
  public content!: string;

  /** 활성 댓글 수 (모든 depth 포함) */
  @Expose()
  public commentCount!: number;

  /** 작성일시 */
  @Expose()
  public createdAt!: Date;

  /** 수정일시 */
  @Expose()
  public updatedAt!: Date;

  constructor(data: Partial<Post>) {
    Object.assign(this, data);
  }
}
