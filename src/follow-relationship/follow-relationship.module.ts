import { Module } from '@nestjs/common';
import { FollowRelationshipService } from './follow-relationship.service';
import { FollowRelationshipController } from './follow-relationship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowRelationship } from './entities/follow-relationship.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FollowRelationship])],
  controllers: [FollowRelationshipController],
  providers: [FollowRelationshipService],
})
export class FollowRelationshipModule {}
