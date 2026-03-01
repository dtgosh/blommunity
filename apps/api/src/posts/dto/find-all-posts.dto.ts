import { ApiSchema } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

@ApiSchema({
  name: '게시물 목록 검색 조건',
  description: '게시물 목록 조회 요청 시 전달하는 필터링 및 페이지네이션 옵션',
})
export class FindAllPostsDto {
  /** 작성자 ID로 필터링 */
  @IsOptional()
  @IsInt()
  public authorId?: bigint;

  /** 그룹 ID로 필터링 */
  @IsOptional()
  @IsInt()
  public groupId?: bigint;

  /** 건너뛸 항목 수 (페이지네이션) */
  @IsOptional()
  @IsInt()
  public page?: number;

  /** 가져올 항목 수 (페이지네이션) */
  @IsOptional()
  @IsInt()
  public size?: number;
}
