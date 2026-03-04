import type { GroupListItem } from '@app/group/group.interfaces';
import { BigIntId } from '@app/util/decorators/bigint-id.decorator';
import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { GroupVisibility } from 'generated/prisma/enums';

@ApiSchema({
  name: '그룹 요약 정보',
  description: '그룹 목록 응답에 포함되는 개별 항목 정보',
})
export class GroupListItemEntity {
  /** 그룹 ID */
  @Expose()
  @BigIntId()
  public id!: string;

  /** 그룹 이름 */
  @Expose()
  public name!: string;

  /** 공개 범위 */
  @Expose()
  public visibility!: GroupVisibility;

  /** 생성일시 */
  @Expose()
  public createdAt!: Date;

  constructor(data: GroupListItem) {
    Object.assign(this, data);
  }
}
