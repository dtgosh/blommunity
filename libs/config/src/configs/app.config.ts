import { registerAs } from '@nestjs/config';
import { defaultAppConfig } from '../config.constants';
import { Env } from '../config.enums';
import { AppConfig } from '../config.interfaces';

export default registerAs(
  'app',
  (): AppConfig => ({
    env: (process.env.NODE_ENV as Env) || defaultAppConfig.env,
    port: parseInt(process.env.PORT || `${defaultAppConfig.port}`, 10),
    name: process.env.APP_NAME || defaultAppConfig.name,
  }),
);
