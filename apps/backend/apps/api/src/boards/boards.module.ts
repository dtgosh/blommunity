import { BoardModule } from '@app/board';
import { SpaceModule } from '@app/space';
import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';

@Module({
  imports: [BoardModule, SpaceModule],
  controllers: [BoardsController],
})
export class BoardsModule {}
