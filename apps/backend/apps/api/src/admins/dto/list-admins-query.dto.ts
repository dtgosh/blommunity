import { ApiSchema } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { AdminStatus } from '../admins.enums';

@ApiSchema({
  description: '관리자 목록 조회 시 사용하는 쿼리 필터',
})
export class ListAdminsQueryDto {
  /** 승인 상태 (pending: 미승인, approved: 승인됨) */
  @IsOptional()
  @IsEnum(AdminStatus)
  public status?: AdminStatus;
}
