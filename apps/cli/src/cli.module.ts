import { ConfigModule } from '@app/config';
import { DbModule } from '@app/db';
import { UtilModule } from '@app/util';
import { Logger, Module } from '@nestjs/common';
import { BasicCommand } from './commands/basic.command';

@Module({
  imports: [ConfigModule, DbModule, UtilModule],
  providers: [Logger, BasicCommand],
})
export class CliModule {}
