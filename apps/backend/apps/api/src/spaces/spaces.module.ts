import { SpaceModule } from '@app/space';
import { Module } from '@nestjs/common';
import { SpacesController } from './spaces.controller';

@Module({
  imports: [SpaceModule],
  controllers: [SpacesController],
})
export class SpacesModule {}
