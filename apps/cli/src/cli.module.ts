import { configModuleOptions } from '@app/config';
import { DbModule } from '@app/db';
import { UtilModule } from '@app/util';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BasicCommand } from './commands/basic.command';

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), DbModule, UtilModule],
  providers: [BasicCommand],
})
export class CliModule {}
