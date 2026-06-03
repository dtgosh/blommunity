import { Role } from '@app/db';
import { ApiSchema } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

@ApiSchema({
  description: '관리자 권한 임명 요청 시 전달하는 정보',
})
export class AssignRoleDto {
  /** 임명할 권한 (MANAGER 또는 MEMBER) */
  @IsIn([Role.MANAGER, Role.MEMBER])
  public role!: typeof Role.MANAGER | typeof Role.MEMBER;
}
