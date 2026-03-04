import type { GroupDetail } from '@app/group/group.interfaces';
import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { GroupListItemEntity } from './group-list-item.entity';

@ApiSchema({
  name: '그룹 상세 조회 결과',
  description: '그룹 상세 조회 응답에 포함되는 정보',
})
export class GroupDetailEntity extends GroupListItemEntity {
  /** 그룹 설명 */
  @Expose()
  public description!: string | null;

  /** 수정일시 */
  @Expose()
  public updatedAt!: Date;

  constructor(data: GroupDetail) {
    super(data);
  }
}
