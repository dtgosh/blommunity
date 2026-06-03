import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Admin, Role } from '@app/db';

@ApiSchema({
  description: '관리자 조회 응답에 포함되는 정보',
})
export class AdminEntity {
  /** 관리자 ID */
  @Expose()
  public id!: string;

  /** 관리자 이름 */
  @Expose()
  public name!: string;

  /** 관리자 이메일 */
  @Expose()
  public email!: string;

  /** 관리자 권한 */
  @Expose()
  public role!: Role;

  /** 승인 일시 (null이면 승인 대기) */
  @Expose()
  public approvedAt!: Date | null;

  /** 승인자 ID */
  @Expose()
  public approverId!: string | null;

  /** 생성일시 */
  @Expose()
  public createdAt!: Date;

  /** 수정일시 */
  @Expose()
  public updatedAt!: Date;

  constructor(admin: Partial<Admin>) {
    Object.assign(this, admin);
  }
}
