import { ConfigModule } from '@app/config';
import { DbModule } from '@app/db';
import { UtilModule } from '@app/util';
import KeyvValkey from '@keyv/valkey';
import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        stores: new KeyvValkey(configService.getOrThrow<string>('cache.url')),
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    DbModule,
    UtilModule,
    PostsModule,
  ],
  providers: [Logger],
})
export class ApiModule {}
