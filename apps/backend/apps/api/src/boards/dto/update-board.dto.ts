import { ApiSchema, PartialType } from '@nestjs/swagger';
import { CreateBoardDto } from './create-board.dto';

@ApiSchema({
  description: '게시판 수정 요청 시 전달하는 정보 (모든 필드 선택)',
})
export class UpdateBoardDto extends PartialType(CreateBoardDto) {}
