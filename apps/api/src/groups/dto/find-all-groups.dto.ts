import { ApiSchema } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

@ApiSchema({
  name: '그룹 목록 검색 조건',
  description: '그룹 목록 조회 요청 시 전달하는 페이지네이션 옵션',
})
export class FindAllGroupsDto {
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
