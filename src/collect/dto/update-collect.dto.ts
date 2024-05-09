import { IsNotEmpty } from 'class-validator';

export class UpdateCollectDto {
  @IsNotEmpty()
  videoId: number;
}
