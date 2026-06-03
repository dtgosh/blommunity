import {
  Admin,
  AdminFindManyArgs,
  AdminFindUniqueOrThrowArgs,
  AdminUpdateArgs,
  DbService,
} from '@app/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  constructor(private readonly dbService: DbService) {}

  public findAll(where: AdminFindManyArgs['where']): Promise<Admin[]> {
    return this.dbService.admin.findMany({ where });
  }

  public findOne(where: AdminFindUniqueOrThrowArgs['where']): Promise<Admin> {
    return this.dbService.admin.findUniqueOrThrow({ where });
  }

  public update(args: AdminUpdateArgs): Promise<Admin> {
    return this.dbService.admin.update(args);
  }

  public async remove(where: AdminUpdateArgs['where']): Promise<void> {
    await this.dbService.admin.update({
      where,
      data: { deletedAt: new Date() },
    });
  }
}
