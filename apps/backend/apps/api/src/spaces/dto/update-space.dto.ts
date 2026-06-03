import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateSpaceDto } from './create-space.dto';

@ApiSchema({
  description: '공간 수정 요청 시 전달하는 정보 (모든 필드 선택)',
})
export class UpdateSpaceDto extends PartialType(CreateSpaceDto) {}
