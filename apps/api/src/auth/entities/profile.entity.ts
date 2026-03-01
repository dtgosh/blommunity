import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AccountRole } from 'generated/prisma/client';
import type { AuthenticatedUser } from '../auth.interfaces';

@ApiSchema({
  name: '내 계정 프로필',
  description: '프로필 조회 응답에 포함되는 계정 정보',
})
export class ProfileEntity {
  /** 계정 ID */
  @Expose()
  public id!: string;

  /** 사용자 아이디 */
  @Expose()
  public username!: string;

  /** 계정 권한 */
  @ApiProperty({ enum: AccountRole })
  @Expose()
  public role!: AccountRole;

  constructor(user: AuthenticatedUser) {
    Object.assign(this, user);

    this.id = this.id.toString();
  }
}
