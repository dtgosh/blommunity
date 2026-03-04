import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';

@ApiSchema({
  name: '댓글 수정 입력 정보',
  description: '댓글 수정 요청 시 전달하는 정보 (모든 필드 선택)',
})
export class UpdateCommentDto extends PartialType(CreateCommentDto) {}
