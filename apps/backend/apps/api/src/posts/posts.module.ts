import { BoardModule } from '@app/board';
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostModule } from '@app/post';

@Module({
  imports: [PostModule, BoardModule],
  controllers: [PostsController],
})
export class PostsModule {}
