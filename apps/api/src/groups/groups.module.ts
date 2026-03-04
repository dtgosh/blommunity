import { GroupModule } from '@app/group';
import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';

@Module({
  imports: [GroupModule],
  controllers: [GroupsController],
})
export class GroupsModule {}
