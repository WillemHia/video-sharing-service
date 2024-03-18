import { Injectable } from '@nestjs/common';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Interaction } from './entities/interaction.entity';
import { Repository } from 'typeorm';

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

  getTotalInteractionsByUserId(userId: number) {
    return this.interactionRepository
      .createQueryBuilder('interaction')
      .leftJoinAndSelect('interaction.video', 'video')
      .where('video.userId = :userId', { userId })
      .getCount();
  }

  findOne(id: number) {
    return `This action returns a #${id} interaction`;
  }

  update(id: number, updateInteractionDto: UpdateInteractionDto) {
    return `This action updates a #${id} interaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} interaction`;
  }
}
