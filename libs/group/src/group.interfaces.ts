import { Account, Group } from 'generated/prisma/client';
import { GroupUpdateArgs } from 'generated/prisma/models';

export type GroupDetail = Omit<Group, 'deletedAt'>;

export type GroupListItem = Pick<
  Group,
  'id' | 'name' | 'visibility' | 'createdAt'
>;

export interface FindAllGroupsArgs {
  page?: number;
  size?: number;
}

export interface RemoveGroupArgs {
  groupId: GroupUpdateArgs['where']['id'];
  accountRole: Account['role'];
}

export interface FindAllGroupsResult {
  totalCount: number;
  items: GroupListItem[];
}
