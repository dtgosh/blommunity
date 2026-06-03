import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import type { MembershipStatus, Role, SpaceUser } from '@app/db';

@ApiSchema({
  description: '공간 사용자(멤버 또는 초대 대기 중)의 상세 정보',
})
export class SpaceUserEntity {
  /** 멤버십 ID */
  @Expose()
  public id!: string;

  /** 공간 ID */
  @Expose()
  public spaceId!: string;

  /** 사용자 ID */
  @Expose()
  public userId!: string;

  /** 공간 내 역할 */
  @Expose()
  public role!: Role;

  /** 멤버십 상태 (PENDING: 초대 대기, ACTIVE: 멤버) */
  @Expose()
  public status!: MembershipStatus;

  /** 생성일시 */
  @Expose()
  public createdAt!: Date;

  constructor(data: Partial<SpaceUser>) {
    Object.assign(this, data);
  }
}
