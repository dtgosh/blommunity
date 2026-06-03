import { CommentModule } from '@app/comment';
import { PostModule } from '@app/post';
import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';

@Module({
  imports: [CommentModule, PostModule],
  controllers: [CommentsController],
})
export class CommentsModule {}
