import { Expose } from 'class-transformer';
import { AccountRole } from 'generated/prisma/client';
import { AuthenticatedUser } from '../auth.interfaces';

export class ProfileEntity {
  @Expose()
  public id!: string;

  @Expose()
  public username!: string;

  @Expose()
  public role!: AccountRole;

  constructor(user: AuthenticatedUser) {
    Object.assign(this, user);

    this.id = this.id.toString();
  }
}
