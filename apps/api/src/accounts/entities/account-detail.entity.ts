import type { AccountDetail } from '@app/account/account.interfaces';
import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AccountListItemEntity } from './account-list-item.entity';

@ApiSchema({
  name: '계정 상세 조회 결과',
  description: '계정 상세 조회 응답에 포함되는 정보',
})
export class AccountDetailEntity extends AccountListItemEntity {
  /** 이메일 주소 */
  @Expose()
  public email!: string | null;

  /** 수정일시 */
  @Expose()
  public updatedAt!: Date;

  constructor(data: AccountDetail) {
    super(data);
  }
}
