import { IsNotEmpty } from 'class-validator';

export class CreateSearchHistoryDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  content: string;
}
