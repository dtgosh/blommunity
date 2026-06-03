import { ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

@ApiSchema({
  description: '대상 계정에 적용할 새 비밀번호',
})
export class ResetPasswordDto {
  /** 새 비밀번호 (8자 이상) */
  @IsNotEmpty()
  @MinLength(8)
  public newPassword!: string;
}
