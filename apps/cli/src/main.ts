import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { CliModule } from './cli.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(CliModule);

  const configService = app.get(ConfigService);

  const port = configService.getOrThrow<number>('PORT');

  await app.listen(port);
}
void bootstrap();
