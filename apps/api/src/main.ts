import { LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApiModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);

  app.useLogger(configService.getOrThrow<LoggerService>('logger'));

  await app.listen(configService.getOrThrow<number>('app.port'));
}
void bootstrap();
