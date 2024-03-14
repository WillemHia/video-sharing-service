import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    private userService: UserService,
  ) {}
  async create(createVideoDto: CreateVideoDto) {
    const video = new Video();
    video.introduce = createVideoDto.introduce;
    video.label = createVideoDto.label;
    video.poster = createVideoDto.poster;
    video.totalTime = createVideoDto.totalTime;
    video.url = createVideoDto.url;
    const { userId } = createVideoDto;
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }
    video.user = user;
    return this.videoRepository.save(video);
  }

  findAll() {
    return `This action returns all video`;
  }

  findOne(id: number) {
    return `This action returns a #${id} video`;
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
