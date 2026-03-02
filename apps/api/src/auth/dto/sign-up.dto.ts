import { ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { SignInDto } from './sign-in.dto';

@ApiSchema({
  name: '회원가입 계정 정보',
  description: '회원가입 요청 시 전달하는 계정 정보',
})
export class SignUpDto extends SignInDto {
  /** 이메일 주소 */
  @IsOptional()
  @IsEmail()
  public email?: string;
}
