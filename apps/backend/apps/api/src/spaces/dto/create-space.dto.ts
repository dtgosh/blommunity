import { ApiSchema } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Visibility } from '@app/db';

@ApiSchema({
  description: '공간 생성 요청 시 전달하는 정보',
})
export class CreateSpaceDto {
  /** 공간 이름 */
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
