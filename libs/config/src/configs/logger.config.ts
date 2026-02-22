import { LoggerService } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { isRemoteEnv } from '../config.constants';

export default registerAs(
  'logger',
  (): LoggerService =>
    WinstonModule.createLogger({
      transports: new winston.transports.Console({
        format: isRemoteEnv
          ? winston.format.combine(
              winston.format.timestamp(),
              winston.format.json(),
            )
          : winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              utilities.format.nestLike('BlommunityApi', {
                colors: true,
                prettyPrint: true,
                processId: true,
                appName: true,
              }),
            ),
      }),
    }),
);
