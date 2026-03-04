import { ApiSchema } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GroupVisibility } from 'generated/prisma/enums';

@ApiSchema({
  name: '그룹 생성 입력 정보',
  description: '그룹 생성 요청 시 전달하는 정보',
})
export class CreateGroupDto {
  /** 그룹 이름 */
  @IsNotEmpty()
  @IsString()
  public name!: string;

  /** 그룹 설명 */
  @IsOptional()
  @IsString()
  public description?: string;

  /** 공개 범위 */
  @IsNotEmpty()
  @IsEnum(GroupVisibility)
  public visibility!: GroupVisibility;
}
