import { Injectable } from '@nestjs/common';
import { CreateFollowRelationshipDto } from './dto/create-follow-relationship.dto';
import { UpdateFollowRelationshipDto } from './dto/update-follow-relationship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowRelationship } from './entities/follow-relationship.entity';
import { Video } from 'src/video/entities/video.entity';

@Injectable()
export class FollowRelationshipService {
  constructor(
    @InjectRepository(FollowRelationship)
    private followRepository: Repository<FollowRelationship>,
    @InjectRepository(Video)
    private readonly videoRepository: Repository<Video>,
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

  userUnFollow(
    userId: number,
    updateFollowRelationshipDto: UpdateFollowRelationshipDto,
  ) {
    return this.followRepository.update(
      {
        userId,
        followedId: updateFollowRelationshipDto.followedId,
      },
      { isDeleted: 1 },
    );
  }

  async userFollow(
    userId: number,
    updateFollowRelationshipDto: UpdateFollowRelationshipDto,
  ) {
    const data = await this.findOne(
      userId,
      updateFollowRelationshipDto.followedId,
    );
    if (data) {
      return this.followRepository.update(
        {
          userId,
          followedId: updateFollowRelationshipDto.followedId,
        },
        { isDeleted: 0 },
      );
    } else {
      return this.create({
        userId,
        followedId: updateFollowRelationshipDto.followedId,
      });
    }
  }

  findOneByUserIdAndFollowedId(userId: number, followedId: number) {
    return this.followRepository.findOne({
      where: { userId, followedId, isDeleted: 0 },
    });
  }

  async findOneByUserIdAndVideoId(userId: number, videoId: number) {
    const video = await this.videoRepository.findOne({
      where: { id: videoId, isDelete: false },
    });
    console.log(video);
    if (!video) {
      throw new Error('Video not found');
    }

    if (video.userId === userId) {
      return true;
    }

    const followRelationship = await this.followRepository.findOne({
      where: {
        userId: video.userId,
        followedId: userId, // 获取视频创建者的用户 ID
        isDeleted: 0, // 确保关系没有被删除
      },
    });

    return !!followRelationship;
  }
}
