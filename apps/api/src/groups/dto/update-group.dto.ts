import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateGroupDto } from './create-group.dto';

@ApiSchema({
  name: '그룹 수정 입력 정보',
  description: '그룹 수정 요청 시 전달하는 정보 (모든 필드 선택)',
})
export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
