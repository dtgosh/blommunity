import { CommentModule } from '@app/comment';
import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';

@Module({
  imports: [CommentModule],
  controllers: [CommentsController],
})
export class CommentsModule {}
