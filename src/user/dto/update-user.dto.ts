import { IsNotEmpty } from 'class-validator';
export class UpdateUserDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  introduce: string;
  @IsNotEmpty()
  sex: number;
  @IsNotEmpty()
  school: string;
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  age: number;
}
