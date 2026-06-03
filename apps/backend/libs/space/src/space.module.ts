import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';

@Module({
  providers: [SpaceService],
  exports: [SpaceService],
})
export class SpaceModule {}
