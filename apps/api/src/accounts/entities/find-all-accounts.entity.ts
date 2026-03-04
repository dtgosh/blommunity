import type { FindAllAccountsResult } from '@app/account/account.interfaces';
import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AccountListItemEntity } from './account-list-item.entity';

@ApiSchema({
  name: '계정 목록 조회 결과',
  description: '계정 목록 조회 응답에 포함되는 결과',
})
export class FindAllAccountsEntity {
  /** 전체 계정 수 */
  @Expose()
  public totalCount!: number;

  /** 계정 목록 */
  @Expose()
  public items!: AccountListItemEntity[];

  constructor(data: FindAllAccountsResult) {
    this.totalCount = data.totalCount;
    this.items = data.items.map((item) => new AccountListItemEntity(item));
  }
}
