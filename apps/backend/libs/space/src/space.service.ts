import {
  DbService,
  Space,
  SpaceCreateArgs,
  SpaceFindManyArgs,
  SpaceFindUniqueOrThrowArgs,
  SpaceUpdateArgs,
} from '@app/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpaceService {
  constructor(private readonly dbService: DbService) {}

  public create(data: SpaceCreateArgs['data']): Promise<Space> {
    return this.dbService.space.create({ data });
  }

  public findAll(where: SpaceFindManyArgs['where']): Promise<Space[]> {
    return this.dbService.space.findMany({ where });
  }

  public findOne(where: SpaceFindUniqueOrThrowArgs['where']): Promise<Space> {
    return this.dbService.space.findUniqueOrThrow({ where });
  }

  public update(args: SpaceUpdateArgs): Promise<Space> {
    return this.dbService.space.update(args);
  }

  public async remove(where: SpaceUpdateArgs['where']): Promise<void> {
    await this.dbService.space.update({
      where,
      data: { deletedAt: new Date() },
    });
  }
}
