import { UserModule } from '@app/user';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [UsersController],
})
export class UsersModule {}
