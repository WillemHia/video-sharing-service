import { Injectable } from '@nestjs/common';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Label } from './entities/label.entity';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
  ) {}
  create(createLabelDto: CreateLabelDto) {
    const label = this.labelRepository.create(createLabelDto);
    return this.labelRepository.save(label);
  }

  findAll() {
    return this.labelRepository.find({
      order: {
        createTime: 'DESC',
      },
      take: 10,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} label`;
  }

  update(id: number, updateLabelDto: UpdateLabelDto) {
    return `This action updates a #${id} label`;
  }

  remove(id: number) {
    return `This action removes a #${id} label`;
  }

  findOneByName(name: string) {
    return this.labelRepository.findOneBy({ name });
  }

  findAllByName(name: string) {
    //根据name模糊查询
    return this.labelRepository.find({
      where: { name: Like(`${name}%`) },
      order: {
        createTime: 'DESC',
      },
      take: 10,
    });
  }
}
