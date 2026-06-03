import { ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@ApiSchema({
  description: '관리자 로그인 요청 시 전달하는 인증 정보',
})
export class AdminSignInDto {
  /** 이메일 주소 */
  @IsNotEmpty()
  @IsEmail()
  public email!: string;

  /** 비밀번호 (8자 이상) */
  @IsNotEmpty()
  @MinLength(8)
  public password!: string;
}
