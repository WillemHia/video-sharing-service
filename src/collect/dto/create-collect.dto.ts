import { IsNotEmpty } from 'class-validator';

export class CreateCollectDto {
  @IsNotEmpty()
  userId: number;
  @IsNotEmpty()
  videoId: number;
}
