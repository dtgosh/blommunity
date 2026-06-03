import { ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

@ApiSchema({
  description: '댓글 생성 요청 시 전달하는 정보',
})
export class CreateCommentDto {
  /** 소속 게시물 ID */
  @IsNotEmpty()
  @IsUUID()
  public postId!: string;

  /** 상위 댓글 ID (대댓글인 경우) */
  @IsOptional()
  @IsUUID()
  public parentId?: string | null;

  /** 댓글 내용 */
  @IsNotEmpty()
  @IsString()
  public content!: string;
}
