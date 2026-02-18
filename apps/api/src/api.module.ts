import { configModuleOptions } from '@app/config';
import { DbModule } from '@app/db';
import { UtilModule } from '@app/util';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), DbModule, UtilModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
