import { configModuleOptions } from '@app/config';
import { DbModule } from '@app/db';
import { UtilModule } from '@app/util';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CliController } from './cli.controller';
import { CliService } from './cli.service';

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), DbModule, UtilModule],
  controllers: [CliController],
  providers: [CliService],
})
export class CliModule {}
