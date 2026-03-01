import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

@ApiSchema({
  name: '게시물 수정 입력 정보',
  description: '게시물 수정 요청 시 전달하는 정보 (모든 필드 선택)',
})
export class UpdatePostDto extends PartialType(CreatePostDto) {}
