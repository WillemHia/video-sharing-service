import { Injectable } from '@nestjs/common';
import { CreateFollowRelationshipDto } from './dto/create-follow-relationship.dto';
import { UpdateFollowRelationshipDto } from './dto/update-follow-relationship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowRelationship } from './entities/follow-relationship.entity';

@Injectable()
export class FollowRelationshipService {
  constructor(
    @InjectRepository(FollowRelationship)
    private followRepository: Repository<FollowRelationship>,
  ) {}
  create(createFollowRelationshipDto: CreateFollowRelationshipDto) {
    const follow = this.followRepository.create(createFollowRelationshipDto);
    return this.followRepository.save(follow);
  }

  findAll() {
    return `This action returns all followRelationship`;
  }

  findOne(userId: number, followedId: number) {
    return this.followRepository.findOne({
      where: { userId, followedId },
    });
  }

  update(id: number, updateFollowRelationshipDto: UpdateFollowRelationshipDto) {
    return `This action updates a #${id} followRelationship`;
  }

  remove(id: number) {
    return `This action removes a #${id} followRelationship`;
  }

  getFansCount(followedId: number) {
    return this.followRepository.count({
      where: { followedId: followedId, isDeleted: 0 },
    });
  }

  getFollowingsCount(userId: number) {
    return this.followRepository.count({
      where: { userId: userId, isDeleted: 0 },
    });
  }

  userUnFollow(updateFollowRelationshipDto: UpdateFollowRelationshipDto) {
    return this.followRepository.update(
      {
        userId: updateFollowRelationshipDto.userId,
        followedId: updateFollowRelationshipDto.followedId,
      },
      { isDeleted: 1 },
    );
  }

  async userFollow(updateFollowRelationshipDto: UpdateFollowRelationshipDto) {
    const data = await this.findOne(
      updateFollowRelationshipDto.userId,
      updateFollowRelationshipDto.followedId,
    );
    if (data) {
      return this.followRepository.update(
        {
          userId: updateFollowRelationshipDto.userId,
          followedId: updateFollowRelationshipDto.followedId,
        },
        { isDeleted: 0 },
      );
    } else {
      return this.create(updateFollowRelationshipDto);
    }
  }
}
