import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentLikeDto } from './create-comment-like.dto';

export class UpdateCommentLikeDto extends PartialType(CreateCommentLikeDto) {}
