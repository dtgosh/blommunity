import { CacheModule } from '@app/cache';
import { ConfigModule } from '@app/config';
import { DbModule } from '@app/db';
import { UtilModule } from '@app/util';
import { Logger, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    CacheModule,
    ConfigModule,
    DbModule,
    UtilModule,
    AuthModule,
    PostsModule,
  ],
  providers: [Logger],
})
export class ApiModule {}
