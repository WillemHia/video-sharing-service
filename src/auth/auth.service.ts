import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Md5 } from 'ts-md5';
import { UserService } from './../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(phoneNumber: string, pass: string) {
    const user = await this.userService.findOneByPhoneNumber(phoneNumber);
    if (!user) {
      return {
        code: 400,
        message: '用户不存在，请先注册',
      };
    }
    if (user.password !== Md5.hashStr(pass)) {
      return {
        code: 400,
        message: '密码错误，请重新输入',
      };
    }
    const payload = { id: user.id };
    return {
      code: 200,
      token: await this.jwtService.signAsync(payload),
    };
  }
}
