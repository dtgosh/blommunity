import type { FindAllGroupsResult } from '@app/group/group.interfaces';
import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { GroupListItemEntity } from './group-list-item.entity';

@ApiSchema({
  name: '그룹 목록 조회 결과',
  description: '그룹 목록 조회 응답에 포함되는 결과',
})
export class FindAllGroupsEntity {
  /** 전체 그룹 수 */
  @Expose()
  public totalCount!: number;

  /** 그룹 목록 */
  @Expose()
  public items!: GroupListItemEntity[];

  constructor(data: FindAllGroupsResult) {
    this.totalCount = data.totalCount;
    this.items = data.items.map((item) => new GroupListItemEntity(item));
  }
}
