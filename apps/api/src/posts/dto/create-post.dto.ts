import { BigIntId } from '@app/util/decorators/bigint-id.decorator';
import { ApiSchema } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@ApiSchema({
  name: '게시물 생성 입력 정보',
  description: '게시물 생성 요청 시 전달하는 정보',
})
export class CreatePostDto {
  /** 그룹 ID */
  @IsOptional()
  @BigIntId()
  public groupId?: bigint | null;

  /** 게시물 제목 */
  @IsNotEmpty()
  @IsString()
  public title!: string;

  /** 게시물 본문 */
  @IsOptional()
  @IsString()
  public content?: string;

  /** 공개 여부 */
  @IsOptional()
  @IsBoolean()
  public isPublished?: boolean;
}
