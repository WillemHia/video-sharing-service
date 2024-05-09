import { Module } from '@nestjs/common';
import { FollowRelationshipService } from './follow-relationship.service';
import { FollowRelationshipController } from './follow-relationship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowRelationship } from './entities/follow-relationship.entity';
import { Video } from 'src/video/entities/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FollowRelationship, Video])],
  controllers: [FollowRelationshipController],
  providers: [FollowRelationshipService],
  exports: [FollowRelationshipService],
})
export class FollowRelationshipModule {}
