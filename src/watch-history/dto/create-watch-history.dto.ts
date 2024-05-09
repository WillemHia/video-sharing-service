import { IsNotEmpty } from 'class-validator';

export class CreateWatchHistoryDto {
  @IsNotEmpty()
  videoId: number;
  @IsNotEmpty()
  progress: number;
}
