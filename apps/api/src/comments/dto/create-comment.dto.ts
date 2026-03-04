import { BigIntId } from '@app/util/decorators/bigint-id.decorator';
import { ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@ApiSchema({
  name: '댓글 생성 입력 정보',
  description: '댓글 생성 요청 시 전달하는 정보',
})
export class CreateCommentDto {
  /** 게시물 ID */
  @IsNotEmpty()
  @BigIntId()
  public postId!: bigint;

  /** 상위 댓글 ID (대댓글인 경우) */
  @IsOptional()
  @BigIntId()
  public parentCommentId?: bigint | null;

  /** 댓글 내용 */
  @IsNotEmpty()
  @IsString()
  public content!: string;
}
