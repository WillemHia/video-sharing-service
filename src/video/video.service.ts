import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabelService } from 'src/label/label.service';
import { Interaction } from 'src/interaction/entities/interaction.entity';
import { Collect } from 'src/collect/entities/collect.entity';

@Injectable()
export class VideoService {
  findInteractionByUserId(userId: string): Video[] | PromiseLike<Video[]> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(Interaction)
    private interactionRepository: Repository<Interaction>,
    @InjectRepository(Collect)
    private collectRepository: Repository<Collect>,
    private labelService: LabelService,
  ) {}
  async create(createVideoDto: CreateVideoDto) {
    await Promise.all(
      createVideoDto.labelNames.map(async (name) => {
        const label = await this.labelService.findOneByName(name);
        if (!label) {
          await this.labelService.create({ name });
        }
      }),
    );
    const label = createVideoDto.labelNames.join('/');
    const video = this.videoRepository.create({ ...createVideoDto, label });
    return this.videoRepository.save(video);
  }

  findAllByUserId(userId: number) {
    return this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.interaction', 'interaction')
      .where('video.userId = :userId', { userId })
      .getMany();
  }

  async findVideoByInteraction(userId: number) {
    const interactions = await this.interactionRepository
      .createQueryBuilder('interaction')
      .innerJoinAndSelect('interaction.video', 'video')
      .where('interaction.userId = :userId', { userId })
      .getMany();

    const videoIds = interactions.map((interaction) => interaction.video.id);
    const videos = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.interaction', 'interaction')
      .where('video.id IN (:...ids)', { ids: videoIds })
      .getMany();
    return videos;
  }

  async findVideoByCollect(userId: number) {
    const collects = await this.collectRepository.find({
      where: { userId },
      relations: ['video'],
    });

    const videoIds = collects.map((collect) => collect.video.id);
    const videos = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.interaction', 'interaction')
      .where('video.id IN (:...ids)', { ids: videoIds })
      .getMany();
    return videos;
  }

  findCountByUserId(userId: number) {
    return this.videoRepository.count({
      where: {
        userId,
        isDelete: false,
      },
    });
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
