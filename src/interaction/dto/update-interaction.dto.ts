import { IsNotEmpty } from 'class-validator';

export class UpdateInteractionDto {
  @IsNotEmpty()
  videoId: number;
  @IsNotEmpty()
  interactionType: number;
}
