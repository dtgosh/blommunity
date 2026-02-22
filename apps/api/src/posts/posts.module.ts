import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostModule } from '@app/post';

@Module({
  imports: [PostModule],
  controllers: [PostsController],
})
export class PostsModule {}
