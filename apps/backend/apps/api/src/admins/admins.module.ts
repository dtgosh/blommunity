import { AdminModule } from '@app/admin';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminAuditInterceptor } from './admin-audit.interceptor';
import { AdminsController } from './admins.controller';

@Module({
  imports: [AdminModule],
  controllers: [AdminsController],
  providers: [{ provide: APP_INTERCEPTOR, useClass: AdminAuditInterceptor }],
})
export class AdminsModule {}
