import {
  DbService,
  Post,
  PostCreateArgs,
  PostFindManyArgs,
  PostFindUniqueOrThrowArgs,
  PostUpdateArgs,
} from '@app/db';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  constructor(private readonly dbService: DbService) {}

  public create(data: PostCreateArgs['data']): Promise<Post> {
    return this.dbService.post.create({ data });
  }

  public findAll(where: PostFindManyArgs['where']): Promise<Post[]> {
    return this.dbService.post.findMany({ where });
  }

  public findOne(where: PostFindUniqueOrThrowArgs['where']): Promise<Post> {
    return this.dbService.post.findUniqueOrThrow({ where });
  }

  public update(args: PostUpdateArgs): Promise<Post> {
    return this.dbService.post.update(args);
  }

  public async remove(where: PostUpdateArgs['where']): Promise<void> {
    await this.dbService.post.update({
      where,
      data: { deletedAt: new Date() },
    });
  }
}
