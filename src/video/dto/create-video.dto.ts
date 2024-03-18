import { IsNotEmpty } from 'class-validator';
export class CreateVideoDto {
  @IsNotEmpty()
  url: string;
  @IsNotEmpty()
  poster: string;
  @IsNotEmpty()
  introduce: string;
  @IsNotEmpty()
  labelNames: string[];
  @IsNotEmpty()
  totalTime: number;
  @IsNotEmpty()
  userId: number;
}
