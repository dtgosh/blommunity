import { DbService } from '@app/db';
import { Injectable } from '@nestjs/common';
import {
  AccountCreateArgs,
  AccountFindUniqueOrThrowArgs,
  AccountUpdateArgs,
} from 'generated/prisma/models';
import {
  AccountDetail,
  FindAllAccountsArgs,
  FindAllAccountsResult,
} from './account.interfaces';

@Injectable()
export class AccountService {
  private readonly defaultFindAccountDetailArgs = {
    omit: {
      password: true,
      deletedAt: true,
    },
  };

  constructor(private dbService: DbService) {}

  public create(data: AccountCreateArgs['data']): Promise<AccountDetail> {
    return this.dbService.account.create({
      ...this.defaultFindAccountDetailArgs,
      data,
    });
  }

  public async findAll({
    page = 1,
    size = 30,
  }: FindAllAccountsArgs): Promise<FindAllAccountsResult> {
    const where = { deletedAt: null };

    const [totalCount, items] = await Promise.all([
      this.dbService.account.count({ where }),
      this.dbService.account.findMany({
        select: {
          id: true,
          username: true,
          role: true,
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
    id: AccountFindUniqueOrThrowArgs['where']['id'],
  ): Promise<AccountDetail> {
    return this.dbService.account.findUniqueOrThrow({
      ...this.defaultFindAccountDetailArgs,
      where: { id, deletedAt: null },
    });
  }

  public update(
    id: AccountUpdateArgs['where']['id'],
    data: AccountUpdateArgs['data'],
  ): Promise<AccountDetail> {
    return this.dbService.account.update({
      ...this.defaultFindAccountDetailArgs,
      where: { id, deletedAt: null },
      data,
    });
  }

  public async remove(id: AccountUpdateArgs['where']['id']): Promise<void> {
    const where = { deletedAt: null };
    const data = { deletedAt: new Date() };
    const input = { updateMany: { where, data } };

    await this.dbService.account.update({
      where: { id, ...where },
      data: { ...data, memberships: input, posts: input, comments: input },
    });
  }
}
