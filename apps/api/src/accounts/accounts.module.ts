import { AccountModule } from '@app/account';
import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';

@Module({
  imports: [AccountModule],
  controllers: [AccountsController],
})
export class AccountsModule {}
