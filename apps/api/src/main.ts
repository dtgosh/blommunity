import { Env } from '@app/config/config.enums';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ApiModule } from './api.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApiModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const appEnv = configService.getOrThrow<Env>('app.env');
  const appName = configService.getOrThrow<string>('app.name');
  const appPort = configService.getOrThrow<number>('app.port');

  app.useLogger(
    WinstonModule.createLogger({
      transports: new winston.transports.Console({
        format:
          appEnv === Env.Development
            ? winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                utilities.format.nestLike(appName, {
                  colors: true,
                  prettyPrint: true,
                  processId: true,
                  appName: true,
                }),
              )
            : winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
              ),
      }),
    }),
  );

  await app.listen(appPort);
}

void bootstrap();
