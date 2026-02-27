import { CacheModule } from '@app/cache';
import { ConfigModule } from '@app/config';
import { DbModule } from '@app/db';
import { UtilModule } from '@app/util';
import { Logger, Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [CacheModule, ConfigModule, DbModule, UtilModule, PostsModule],
  providers: [Logger],
})
export class ApiModule {}
