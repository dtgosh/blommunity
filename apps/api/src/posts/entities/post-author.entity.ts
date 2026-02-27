import { Account } from '@app/db/generated/client';
import { Expose } from 'class-transformer';

export class PostAuthorEntity {
  @Expose()
  public id!: bigint;

  @Expose()
  public username!: string;

  constructor(partial: Partial<Account>) {
    Object.assign(this, partial);
  }
}
