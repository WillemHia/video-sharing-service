import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return { code: user ? 200 : 10000 };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    let user = {} as User;
    if (Number(id) === 0) {
      const token = req.headers.authorization.split(' ')[1];
      const payload = await this.jwtService.verifyAsync(token);
      user = await this.userService.findOne(payload.id);
    } else {
      user = await this.userService.findOne(Number(id));
    }
    delete user.password;
    const host = req.headers.host;
    const protocol = req.protocol;
    user.avatar = `${protocol}://${host}/images/${user.avatar}`;
    user.backgroundImg = `${protocol}://${host}/images/${user.backgroundImg}`;
    console.log(user);
    return user;
  }

  @Put()
  async update(@Body() updateUserDto: UpdateUserDto) {
    await this.userService.update(updateUserDto);
    return { code: 200 };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
