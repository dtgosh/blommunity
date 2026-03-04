import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';

@ApiSchema({
  name: '계정 수정 입력 정보',
  description: '계정 수정 요청 시 전달하는 정보 (모든 필드 선택)',
})
export class UpdateAccountDto extends PartialType(CreateAccountDto) {}
