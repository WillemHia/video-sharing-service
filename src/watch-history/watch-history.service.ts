import { Injectable } from '@nestjs/common';
import { CreateWatchHistoryDto } from './dto/create-watch-history.dto';
import { UpdateWatchHistoryDto } from './dto/update-watch-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WatchHistory } from './entities/watch-history.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WatchHistoryService {
  constructor(
    @InjectRepository(WatchHistory)
    private watchHistoryRepository: Repository<WatchHistory>,
  ) {}
  async create(createWatchHistoryDto: CreateWatchHistoryDto, userId: number) {
    const data = await this.watchHistoryRepository.findOne({
      where: { videoId: createWatchHistoryDto.videoId, userId },
    });
    console.log(createWatchHistoryDto);
    console.log(data);
    if (data) {
      if (data.progress < createWatchHistoryDto.progress) {
        return this.watchHistoryRepository.update(
          { videoId: createWatchHistoryDto.videoId, userId },
          createWatchHistoryDto,
        );
      }
    } else {
      try {
        // 尝试插入新记录，如果存在重复记录，数据库会抛出错误
        return await this.watchHistoryRepository.save({
          ...createWatchHistoryDto,
          userId,
        });
      } catch (error) {
        console.error('插入记录时发生重复记录错误:', error.message);
      }
    }
  }

  findAll() {
    return `This action returns all watchHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} watchHistory`;
  }

  update(id: number, updateWatchHistoryDto: UpdateWatchHistoryDto) {
    return `This action updates a #${id} watchHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} watchHistory`;
  }
}
