import { Role } from '@app/db';
import { ApiSchema } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

@ApiSchema({
  description: '계정 권한 임명 요청 시 전달하는 정보',
})
export class AssignRoleDto {
  /** 임명할 권한 (OWNER, MANAGER 또는 MEMBER) */
  @IsEnum(Role)
  public role!: Role;
}
