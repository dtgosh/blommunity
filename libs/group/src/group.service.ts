import { DbService } from '@app/db';
import { Injectable } from '@nestjs/common';
import {
  GroupCreateArgs,
  GroupFindUniqueOrThrowArgs,
  GroupUpdateArgs,
} from 'generated/prisma/models';
import {
  FindAllGroupsArgs,
  FindAllGroupsResult,
  GroupDetail,
  RemoveGroupArgs,
} from './group.interfaces';

@Injectable()
export class GroupService {
  private readonly defaultFindGroupDetailArgs = {
    omit: {
      deletedAt: true,
    },
  };

  constructor(private dbService: DbService) {}

  public create(data: GroupCreateArgs['data']): Promise<GroupDetail> {
    return this.dbService.group.create({
      ...this.defaultFindGroupDetailArgs,
      data,
    });
  }

  public async findAll({
    page = 1,
    size = 30,
  }: FindAllGroupsArgs): Promise<FindAllGroupsResult> {
    const where = { deletedAt: null };

    const [totalCount, items] = await Promise.all([
      this.dbService.group.count({ where }),
      this.dbService.group.findMany({
        select: {
          id: true,
          name: true,
          visibility: true,
          createdAt: true,
        },
        where,
        orderBy: { id: 'desc' },
        skip: (page - 1) * size,
        take: size,
      }),
    ]);

    return { totalCount, items };
  }

  public findOne(
    id: GroupFindUniqueOrThrowArgs['where']['id'],
  ): Promise<GroupDetail> {
    return this.dbService.group.findUniqueOrThrow({
      ...this.defaultFindGroupDetailArgs,
      where: { id, deletedAt: null },
    });
  }

  public update(
    id: GroupUpdateArgs['where']['id'],
    data: GroupUpdateArgs['data'],
  ): Promise<GroupDetail> {
    return this.dbService.group.update({
      ...this.defaultFindGroupDetailArgs,
      where: { id, deletedAt: null },
      data,
    });
  }

  public async remove({ groupId }: RemoveGroupArgs): Promise<void> {
    await this.dbService.group.update({
      where: { id: groupId, deletedAt: null },
      data: { deletedAt: new Date() },
    });
  }
}
