import { IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  @IsNotEmpty()
  phoneNumber: string;
  @IsNotEmpty()
  password: string;
}
