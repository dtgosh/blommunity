import { ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AdminSignInDto } from './admin-sign-in.dto';

@ApiSchema({
  description: '관리자 계정을 생성하는 회원가입 요청 정보',
})
export class AdminSignUpDto extends AdminSignInDto {
  /** 관리자 이름 */
  @IsNotEmpty()
  @IsString()
  public name!: string;
}
