import {
  DbService,
  User,
  UserFindManyArgs,
  UserFindUniqueOrThrowArgs,
  UserUpdateArgs,
} from '@app/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DbService) {}

  public findAll(where: UserFindManyArgs['where']): Promise<User[]> {
    return this.dbService.user.findMany({ where });
  }

  public findOne(where: UserFindUniqueOrThrowArgs['where']): Promise<User> {
    return this.dbService.user.findUniqueOrThrow({ where });
  }

  public update(args: UserUpdateArgs): Promise<User> {
    return this.dbService.user.update(args);
  }

  public async remove(where: UserUpdateArgs['where']): Promise<void> {
    await this.dbService.user.update({
      where,
      data: { deletedAt: new Date() },
    });
  }
}
