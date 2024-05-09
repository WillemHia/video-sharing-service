import { Injectable } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabelService } from 'src/label/label.service';
import { Interaction } from 'src/interaction/entities/interaction.entity';
import { Collect } from 'src/collect/entities/collect.entity';
import { CommentService } from 'src/comment/comment.service';
import getVideoByVideoId from 'src/recommend/getVideoByVideoId';
import getVideoByUserId from 'src/recommend/getVideoByUserId';
import { WatchHistory } from 'src/watch-history/entities/watch-history.entity';

@Injectable()
export class VideoService {
  private videoIds: number[] = [];
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<Video>,
    @InjectRepository(Interaction)
    private interactionRepository: Repository<Interaction>,
    @InjectRepository(Collect)
    private collectRepository: Repository<Collect>,
    @InjectRepository(WatchHistory)
    private watchHistoryRepository: Repository<WatchHistory>,
    private labelService: LabelService,
    private commenntService: CommentService,
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

  async findAllByUserId(userId: number) {
    const data = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.interaction', 'interaction')
      .where('video.userId = :userId', { userId })
      .getMany();
    return data.map((v) => {
      v.interactionCount = v.interaction.length;
      delete v.interaction;
      return v;
    });
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

  async findVideoDetailsById(videoId: number) {
    return this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'user')
      .where('video.id = :videoId', { videoId })
      .getOne();
  }

  findeVideoInteractionCountById(videoId: number) {
    return this.interactionRepository.count({
      where: {
        videoId,
      },
    });
  }

  findVideoCollectCountById(videoId: number) {
    return this.collectRepository.count({
      where: {
        videoId,
        isDeleted: 0,
      },
    });
  }

  async findVideoCommentsById(videoId: number) {
    return this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.comment', 'comment')
      .where('video.id = :videoId', { videoId })
      .getOne();
  }

  async findVideoBySearch(search: string) {
    const videos = await this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.user', 'user')
      .where('video.label like :search', { search: `%${search}%` })
      .andWhere('video.introduce like :search', { search: `%${search}%` })
      .getMany();
    return await Promise.all(
      videos.map(async (video) => {
        video.collectCount = await this.findVideoCollectCountById(video.id);
        video.interactionCount = await this.findeVideoInteractionCountById(
          video.id,
        );
        video.commentCount = await this.commenntService.findCountByVideoId(
          video.id,
        );
        return video;
      }),
    );
  }

  async findRecommendByUserId(userId: string) {
    let videoIds: string[] = JSON.parse(getVideoByUserId(userId));
    videoIds = videoIds.filter((v) => !this.videoIds.includes(+v));
    this.videoIds = this.videoIds.concat(videoIds.map((v) => +v));
    return await Promise.all(
      videoIds.map(async (videoId: string) => {
        return await this.findVideoDetailsById(+videoId);
      }),
    );
  }

  async findRecommendByVideoId(videoId: string) {
    let videoIds: string[] = JSON.parse(getVideoByVideoId(videoId));
    videoIds = videoIds.filter((v) => !this.videoIds.includes(+v));
    this.videoIds = this.videoIds.concat(videoIds.map((v) => +v));
    return await Promise.all(
      videoIds.map(async (videoId: string) => {
        return await this.findVideoDetailsById(+videoId);
      }),
    );
  }

  async findRandowVideo() {
    const viodes = await this.videoRepository.find();
    let count = 3;
    while (count > 0) {
      //随机获取一个视频
      const video = viodes[Math.floor(Math.random() * viodes.length)];
      if (this.videoIds.indexOf(video.id) === -1) {
        this.videoIds.push(video.id);
        count--;
      }
    }
    return await Promise.all(
      this.videoIds
        .slice(this.videoIds.length - 3, this.videoIds.length)
        .map(async (videoId: number) => {
          return await this.findVideoDetailsById(videoId);
        }),
    );
  }

  async findRandowByUserId(userId: number) {
    const viodes = await this.videoRepository.find();
    const historyVideos = await this.watchHistoryRepository.find({
      where: { userId },
    });
    let count = 3;
    while (count > 0) {
      //随机获取一个视频
      const video = viodes[Math.floor(Math.random() * viodes.length)];
      if (
        this.videoIds.indexOf(video.id) === -1 &&
        historyVideos.findIndex(
          (historyVideo) => historyVideo.videoId === video.id,
        ) === -1
      ) {
        this.videoIds.push(video.id);
        count--;
      }
    }
    return await Promise.all(
      this.videoIds
        .slice(this.videoIds.length - 3, this.videoIds.length)
        .map(async (videoId: number) => {
          return await this.findVideoDetailsById(videoId);
        }),
    );
  }

  update(id: number, updateVideoDto: UpdateVideoDto) {
    return `This action updates a #${id} video`;
  }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }
}
