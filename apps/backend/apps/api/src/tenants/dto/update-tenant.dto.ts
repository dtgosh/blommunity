import { ApiSchema } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

@ApiSchema({
  description: '테넌트 수정 요청 시 전달하는 정보 (모든 필드 선택)',
})
export class UpdateTenantDto {
  /** 테넌트 이름 */
  @IsOptional()
  @IsString()
  public name?: string;
}
