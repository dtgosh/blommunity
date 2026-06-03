import { DynamicModule } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { isRemoteEnv } from './config.constants';
import appConfig from './configs/app.config';
import secretConfig from './configs/secret.config';

export const ConfigModule: Promise<DynamicModule> = NestConfigModule.forRoot({
  cache: true,
  isGlobal: true,
  ignoreEnvFile: isRemoteEnv,
  skipProcessEnv: true,
  load: [appConfig, secretConfig],
  expandVariables: !isRemoteEnv,
});
