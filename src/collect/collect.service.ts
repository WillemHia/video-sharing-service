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
    return 'This action adds a new collect';
  }

  findCountByUserId(userId: number) {
    return this.collectRepository.count({
      where: {
        userId,
        isDeleted: 0,
      },
    });
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
