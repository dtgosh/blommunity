import { ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

@ApiSchema({
  description: '계정 수정 요청 시 전달하는 정보 (모든 필드 선택)',
})
export class UpdateUserDto {
  /** 사용자 아이디 */
  @IsOptional()
  @IsString()
  public username?: string;

  /** 이메일 주소 */
  @IsOptional()
  @IsEmail()
  public email?: string;
}
