import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { VideoModule } from './video/video.module';
import { LabelModule } from './label/label.module';
import { FollowRelationshipModule } from './follow-relationship/follow-relationship.module';
import { InteractionModule } from './interaction/interaction.module';
import { CollectModule } from './collect/collect.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'video_sharing',
      synchronize: true,
      autoLoadEntities: true,
      logging: true,
    }),
    UserModule,
    UploadModule,
    VideoModule,
    LabelModule,
    FollowRelationshipModule,
    InteractionModule,
    CollectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
