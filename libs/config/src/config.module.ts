import { ConfigModule as NestConfigModule } from '@nestjs/config';
import appConfig from './configs/app.config';
import cacheConfig from './configs/cache.config';
import dbConfig from './configs/db.config';
import loggerConfig from './configs/logger.config';

export const ConfigModule = NestConfigModule.forRoot({
  cache: true,
  isGlobal: true,
  skipProcessEnv: true,
  load: [appConfig, cacheConfig, dbConfig, loggerConfig],
});
