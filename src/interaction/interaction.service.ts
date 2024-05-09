import { Injectable } from '@nestjs/common';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Interaction } from './entities/interaction.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class InteractionService {
  constructor(
    @InjectRepository(Interaction)
    private readonly interactionRepository: Repository<Interaction>,
  ) {}
  create(createInteractionDto: CreateInteractionDto) {
    return 'This action adds a new interaction';
  }

  findCountByUserId(userId: number) {
    return this.interactionRepository.count({
      where: {
        userId,
        isDeleted: 0,
      },
    });
  }

  findCountByVideoId(videoId: number) {
    return this.interactionRepository.count({
      where: {
        videoId,
        isDeleted: 0,
        interactionType: Not(0),
      },
    });
  }

  getTotalInteractionsByUserId(userId: number) {
    return this.interactionRepository
      .createQueryBuilder('interaction')
      .leftJoinAndSelect('interaction.video', 'video')
      .where('video.userId = :userId', { userId })
      .getCount();
  }

  async findOneByUserIdAndVideoId(userId: number, videoId: number) {
    const data = await this.interactionRepository.findOne({
      where: {
        userId,
        videoId,
        isDeleted: 0,
      },
    });

    if (data) {
      return data.interactionType;
    } else {
      return 0;
    }
  }

  async updateInteractionType(userId: number, videoId: number, type: number) {
    const interaction = await this.interactionRepository.findOne({
      where: {
        userId,
        videoId,
      },
    });
    if (interaction) {
      return this.interactionRepository.update(
        {
          userId,
          videoId,
        },
        {
          interactionType: type,
        },
      );
    } else {
      return this.interactionRepository.save({
        userId,
        videoId,
        interactionType: type,
      });
    }
  }

  update(id: number, updateInteractionDto: UpdateInteractionDto) {
    return `This action updates a #${id} interaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} interaction`;
  }
}
