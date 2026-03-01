import type { PostAuthor } from '@app/post/post.interfaces';
import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

@ApiSchema({
  name: '게시물 작성자 정보',
  description: '게시물 응답에 포함되는 작성자 정보',
})
export class PostAuthorEntity {
  /** 작성자 ID */
  @Expose()
  public id!: bigint;

  /** 작성자 아이디 */
  @Expose()
  public username!: string;

  constructor(data: PostAuthor) {
    Object.assign(this, data);
  }
}
