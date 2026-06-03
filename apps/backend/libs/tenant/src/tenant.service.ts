import {
  DbService,
  Tenant,
  TenantFindManyArgs,
  TenantFindUniqueOrThrowArgs,
  TenantUpdateArgs,
} from '@app/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantService {
  constructor(private readonly dbService: DbService) {}

  public findAll(where: TenantFindManyArgs['where']): Promise<Tenant[]> {
    return this.dbService.tenant.findMany({ where });
  }

  public findOne(where: TenantFindUniqueOrThrowArgs['where']): Promise<Tenant> {
    return this.dbService.tenant.findUniqueOrThrow({ where });
  }

  public update(args: TenantUpdateArgs): Promise<Tenant> {
    return this.dbService.tenant.update(args);
  }

  public async remove(where: TenantUpdateArgs['where']): Promise<void> {
    await this.dbService.tenant.update({
      where,
      data: { deletedAt: new Date() },
    });
  }
}
