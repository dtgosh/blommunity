import { ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Role, User, Visibility } from '@app/db';

@ApiSchema({
  description: '프로필 조회 응답에 포함되는 계정 정보',
})
export class UserEntity {
  /** 계정 ID */
  @Expose()
  public id!: string;

  /** 테넌트 ID */
  @Expose()
  public tenantId!: string;

  /** 사용자 아이디 */
  @Expose()
  public username!: string;

  /** 사용자 이메일 */
  @Expose()
  public email!: string | null;

  /** 계정 권한 */
  @Expose()
  public role!: Role;

  /** 계정 가시성 */
  @Expose()
  public visibility!: Visibility;

  /** 계정 생성일 */
  @Expose()
  public createdAt!: Date;

  /** 계정 수정일 */
  @Expose()
  public updatedAt!: Date;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
