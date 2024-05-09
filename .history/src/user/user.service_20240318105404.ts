import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Md5 } from 'ts-md5';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = new User();
    user.phoneNumber = createUserDto.phoneNumber;
    user.userId = new Date().getTime().toString();
    user.password = Md5.hashStr(createUserDto.password);
    user.username = '用户' + user.phoneNumber;
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({
      id,
    });
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id, ...rest } = updateUserDto;
    return await this.userRepository.update(id, { ...rest });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneByPhoneNumber(phoneNumber: string) {
    return await this.userRepository.findOneBy({
      phoneNumber: phoneNumber,
    });
  }

  async updateAvatar(id: number, avatar: string) {
    return await this.userRepository.update(id, {
      avatar: avatar,
    });
  }

  async updateBackground(id: number, backgroundImg: string) {
    return await this.userRepository.update(id, {
      backgroundImg: backgroundImg,
    });
  }
}
