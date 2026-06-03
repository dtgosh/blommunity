import { ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@ApiSchema({
  description: '현재 비밀번호 확인 후 새 비밀번호로 변경',
})
export class ChangePasswordDto {
  /** 현재 비밀번호 */
  @IsNotEmpty()
  @IsString()
  public currentPassword!: string;

  /** 새 비밀번호 (8자 이상) */
  @IsNotEmpty()
  @MinLength(8)
  public newPassword!: string;
}
