import { Injectable } from '@nestjs/common';
import { CreateCollectDto } from './dto/create-collect.dto';
import { UpdateCollectDto } from './dto/update-collect.dto';
import { Collect } from './entities/collect.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CollectService {
  constructor(
    @InjectRepository(Collect)
    private readonly collectRepository: Repository<Collect>,
  ) {}
  create(createCollectDto: CreateCollectDto) {
    const collect = this.collectRepository.create(createCollectDto);
    return this.collectRepository.save(collect);
  }

  findCountByUserId(userId: number) {
    return this.collectRepository.count({
      where: {
        userId,
        isDeleted: 0,
      },
    });
  }

  findOneByUserIdAndVideoId(userId: number, videoId: number) {
    return this.collectRepository.findOne({
      where: {
        userId,
        videoId,
        isDeleted: 0,
      },
    });
  }

  findCountByVideoId(videoId: number) {
    return this.collectRepository.count({
      where: {
        videoId,
        isDeleted: 0,
      },
    });
  }

  async userCollect(userId: number, videoId: number) {
    const collect = await this.collectRepository.findOne({
      where: {
        userId,
        videoId,
      },
    });
    if (collect) {
      return this.collectRepository.update(
        {
          userId,
          videoId,
        },
        { isDeleted: 0 },
      );
    } else {
      return this.create({ userId, videoId });
    }
  }

  userUnCollect(userId: number, videoId: number) {
    return this.collectRepository.update(
      {
        userId,
        videoId,
      },
      { isDeleted: 1 },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} collect`;
  }

  update(id: number, updateCollectDto: UpdateCollectDto) {
    return `This action updates a #${id} collect`;
  }

  remove(id: number) {
    return `This action removes a #${id} collect`;
  }
}
