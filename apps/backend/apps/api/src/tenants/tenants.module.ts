import { TenantModule } from '@app/tenant';
import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';

@Module({
  imports: [TenantModule],
  controllers: [TenantsController],
})
export class TenantsModule {}
