import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Tenant } from '@app/db';

@ApiSchema({
  description: '테넌트 조회 응답에 포함되는 테넌트 정보',
})
export class TenantEntity {
  /** 테넌트 ID */
  @Expose()
  public id!: string;

  /** 테넌트 이름 */
  @Expose()
  public name!: string;

  /** 생성일시 */
  @Expose()
  public createdAt!: Date;

  constructor(tenant: Partial<Tenant>) {
    Object.assign(this, tenant);
  }
}
