import { Expose } from 'class-transformer';
import { Account } from 'generated/prisma/client';

export class PostAuthorEntity {
  @Expose()
  public id!: bigint;

  @Expose()
  public username!: string;

  constructor(partial: Partial<Account>) {
    Object.assign(this, partial);
  }
}
