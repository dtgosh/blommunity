import { Env } from '@app/config/config.enums';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ApiModule } from './api.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(ApiModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const appEnv = configService.getOrThrow<Env>('app.env');
  const appName = configService.getOrThrow<string>('app.name');
  const appPort = configService.getOrThrow<number>('app.port');

  const isDevEnv = appEnv === Env.Development;
  const isProdEnv = appEnv === Env.Production;

  app.useLogger(
    WinstonModule.createLogger({
      transports: new winston.transports.Console({
        format: isDevEnv
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

  app.set('trust proxy', 'loopback');

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      disableErrorMessages: isProdEnv,
      stopAtFirstError: isProdEnv,
    }),
  );

  if (!isProdEnv) {
    const config = new DocumentBuilder()
      .setTitle('Blommunity API 문서')
      .setDescription(
        'Blommunity의 REST API 문서입니다. 인증, 게시물 관리 등의 기능을 제공합니다.',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const documentFactory = (): OpenAPIObject =>
      SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, documentFactory);
  }

  await app.listen(appPort);
}

void bootstrap();
