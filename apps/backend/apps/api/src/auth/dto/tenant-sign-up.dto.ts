import { ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@ApiSchema({
  description: '테넌트와 최초 사용자 계정을 함께 생성하는 회원가입 요청 정보',
})
export class TenantSignUpDto {
  /** 테넌트 이름 */
  @IsNotEmpty()
  @IsString()
  public tenantName!: string;

  /** 사용자 아이디 */
  @IsNotEmpty()
  @IsString()
  public username!: string;

  /** 이메일 주소 */
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  /** 비밀번호 (8자 이상) */
  @IsNotEmpty()
  @MinLength(8)
  public password!: string;
}
