import { Account } from 'generated/prisma/client';

export type AccountDetail = Omit<Account, 'password' | 'deletedAt'>;

export type AccountListItem = Pick<
  Account,
  'id' | 'username' | 'role' | 'createdAt'
>;

export interface FindAllAccountsArgs {
  page?: number;
  size?: number;
}

export interface FindAllAccountsResult {
  totalCount: number;
  items: AccountListItem[];
}
