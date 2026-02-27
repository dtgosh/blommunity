import KeyvValkey from '@keyv/valkey';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const CacheModule = NestCacheModule.registerAsync({
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    stores: new KeyvValkey(configService.getOrThrow<string>('cache.url')),
  }),
  inject: [ConfigService],
});
