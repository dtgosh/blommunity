import { LoggerService } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { validatedEnv } from '../config.constants';
import { Env } from '../config.enums';

export default registerAs(
  'logger',
  (): LoggerService =>
    WinstonModule.createLogger({
      transports: new winston.transports.Console({
        format:
          validatedEnv.NODE_ENV === Env.PRD
            ? winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
              )
            : winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                utilities.format.nestLike('Blommunity', {
                  colors: true,
                  prettyPrint: true,
                  processId: true,
                  appName: true,
                }),
              ),
      }),
    }),
);
