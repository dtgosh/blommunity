import { ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

@ApiSchema({
  description: '게시물 생성 요청 시 전달하는 정보',
})
export class CreatePostDto {
  /** 소속 게시판 ID */
  @IsNotEmpty()
  @IsUUID()
  public boardId!: string;

  /** 게시물 제목 */
  @IsNotEmpty()
  @IsString()
  public title!: string;

  /** 게시물 본문 */
  @IsNotEmpty()
  @IsString()
  public content!: string;
}
