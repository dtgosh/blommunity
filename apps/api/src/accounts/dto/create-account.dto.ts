import { ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@ApiSchema({
  name: '계정 생성 입력 정보',
  description: '계정 생성 요청 시 전달하는 정보',
})
export class CreateAccountDto {
  /** 사용자 이름 */
  @IsNotEmpty()
  @IsString()
  public username!: string;

  /** 비밀번호 */
  @IsNotEmpty()
  @IsString()
  public password!: string;

  /** 이메일 주소 */
  @IsOptional()
  @IsEmail()
  public email?: string;
}
