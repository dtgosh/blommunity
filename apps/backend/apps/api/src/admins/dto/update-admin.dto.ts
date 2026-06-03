import { ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@ApiSchema({
  description: '관리자 수정 요청 시 전달하는 정보 (모든 필드 선택)',
})
export class UpdateAdminDto {
  /** 관리자 이름 */
  @IsOptional()
  @IsString()
  public name?: string;

  /** 이메일 주소 */
  @IsOptional()
  @IsEmail()
  public email?: string;
}
