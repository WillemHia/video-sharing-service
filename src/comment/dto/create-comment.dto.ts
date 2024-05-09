import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  videoId: number;
  @IsNotEmpty()
  content: string;
  @IsOptional()
  parentId: number;
  @IsOptional()
  replyUserId: number;
}
