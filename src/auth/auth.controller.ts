import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() singDto: { phoneNumber: string; password: string }) {
    return this.authService.signIn(singDto.phoneNumber, singDto.password);
  }
}
