import { IsNotEmpty } from 'class-validator';

export class CreateCommentLikeDto {
  @IsNotEmpty()
  commentId: number;
}
