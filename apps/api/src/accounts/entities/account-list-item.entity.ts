import type { AccountListItem } from '@app/account/account.interfaces';
import { BigIntId } from '@app/util/decorators/bigint-id.decorator';
import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AccountRole } from 'generated/prisma/enums';

@ApiSchema({
  name: '계정 요약 정보',
  description: '계정 목록 응답에 포함되는 개별 항목 정보',
})
export class AccountListItemEntity {
  /** 계정 ID */
  @Expose()
  @BigIntId()
  public id!: string;

  /** 사용자 이름 */
  @Expose()
  public username!: string;

  /** 계정 역할 */
  @Expose()
  public role!: AccountRole;

  /** 생성일시 */
  @Expose()
  public createdAt!: Date;

  constructor(data: AccountListItem) {
    Object.assign(this, data);
  }
}
