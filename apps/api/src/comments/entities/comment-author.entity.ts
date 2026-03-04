import type { CommentAuthor } from '@app/comment/comment.interfaces';
import { BigIntId } from '@app/util/decorators/bigint-id.decorator';
import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

@ApiSchema({
  name: '댓글 작성자 정보',
  description: '댓글 응답에 포함되는 작성자 정보',
})
export class CommentAuthorEntity {
  /** 작성자 ID */
  @Expose()
  @BigIntId()
  public id!: string;

  /** 작성자 아이디 */
  @Expose()
  public username!: string;

  constructor(data: CommentAuthor) {
    Object.assign(this, data);
  }
}
