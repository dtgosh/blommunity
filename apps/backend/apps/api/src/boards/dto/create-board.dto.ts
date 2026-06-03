import { ApiSchema } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Visibility } from '@app/db';

@ApiSchema({
  description: '게시판 생성 요청 시 전달하는 정보',
})
export class CreateBoardDto {
  /** 소속 공간 ID */
  @IsNotEmpty()
  @IsUUID()
  public spaceId!: string;

  /** 게시판 이름 */
  @IsNotEmpty()
  @IsString()
  public name!: string;

  /** 설명 */
  @IsOptional()
  @IsString()
  public description?: string;

  /** 가시성 */
  @IsOptional()
  @IsEnum(Visibility)
  public visibility?: Visibility;
}
