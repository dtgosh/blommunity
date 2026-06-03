import { CacheModule } from '@app/cache';
import { ConfigModule } from '@app/config';
import { DbModule } from '@app/db';
import { UtilModule } from '@app/util';
import { Logger, Module } from '@nestjs/common';
import { AdminsModule } from './admins/admins.module';
import { ApiController } from './api.controller';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { SpacesModule } from './spaces/spaces.module';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule,
    CacheModule,
    DbModule,
    UtilModule,
    AuthModule,
    AdminsModule,
    TenantsModule,
    UsersModule,
    SpacesModule,
    BoardsModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [ApiController],
  providers: [Logger],
})
export class ApiModule {}
