import { ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@ApiSchema({
  name: '로그인 인증 정보',
  description: '로그인 요청 시 전달하는 인증 정보',
})
export class SignInDto {
  /** 사용자 아이디 */
  @IsNotEmpty()
  @IsString()
  public username!: string;

  /** 비밀번호 (8자 이상) */
  @IsNotEmpty()
  @MinLength(8)
  public password!: string;
}
