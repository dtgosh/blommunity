import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import type { BoardUser, MembershipStatus, Role } from '@app/db';

@ApiSchema({
  description: '게시판 사용자(멤버 또는 초대 대기 중)의 상세 정보',
})
export class BoardUserEntity {
  /** 멤버십 ID */
  @Expose()
  public id!: string;

  /** 게시판 ID */
  @Expose()
  public boardId!: string;

  /** 사용자 ID */
  @Expose()
  public userId!: string;

  /** 게시판 내 역할 */
  @Expose()
  public role!: Role;

  /** 멤버십 상태 (PENDING: 초대 대기, ACTIVE: 멤버) */
  @Expose()
  public status!: MembershipStatus;

  /** 생성일시 */
  @Expose()
  public createdAt!: Date;

  constructor(data: Partial<BoardUser>) {
    Object.assign(this, data);
  }
}
