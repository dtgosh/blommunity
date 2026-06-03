import KeyvValkey from '@keyv/valkey';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const CacheModule: DynamicModule = NestCacheModule.registerAsync({
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    stores: new KeyvValkey(
      configService.getOrThrow<string>('secret.CACHE_URL'),
    ),
  }),
  inject: [ConfigService],
});
