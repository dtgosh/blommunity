import { ApiSchema } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@ApiSchema({
  name: '회원가입 계정 정보',
  description: '회원가입 요청 시 전달하는 계정 정보',
})
export class SignUpDto {
  /** 사용자 아이디 */
  @IsNotEmpty()
  @IsString()
  public username!: string;

  /** 비밀번호 (8자 이상) */
  @IsNotEmpty()
  @MinLength(8)
  public password!: string;

  /** 이메일 주소 */
  @IsOptional()
  @IsEmail()
  public email?: string;
}
