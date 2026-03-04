import { BigIntId } from '@app/util/decorators/bigint-id.decorator';
import { ApiSchema } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

@ApiSchema({
  name: '댓글 목록 검색 조건',
  description: '댓글 목록 조회 요청 시 전달하는 필터링 및 페이지네이션 옵션',
})
export class FindAllCommentsDto {
  /** 게시물 ID로 필터링 */
  @IsOptional()
  @BigIntId()
  public postId?: bigint;

  /** 작성자 ID로 필터링 */
  @IsOptional()
  @BigIntId()
  public authorId?: bigint;

  /**
   * 페이지 번호 (기본: 1)
   *
   * @example 1
   */
  @IsOptional()
  @IsInt()
  public page?: number;

  /**
   * 페이지별 항목 수 (기본: 30)
   *
   * @example 30
   */
  @IsOptional()
  @IsInt()
  public size?: number;
}
