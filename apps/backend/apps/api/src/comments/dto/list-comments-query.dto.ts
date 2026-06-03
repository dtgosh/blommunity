import { ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

@ApiSchema({
  description: '댓글 목록 조회 시 사용하는 쿼리 필터',
})
export class ListCommentsQueryDto {
  /** 게시물 ID */
  @IsNotEmpty()
  @IsUUID()
  public postId!: string;

  /** 상위 댓글 ID. 지정하지 않으면 최상위 댓글을, 지정하면 해당 댓글의 대댓글을 반환합니다. */
  @IsOptional()
  @IsUUID()
  public parentId?: string;
}
