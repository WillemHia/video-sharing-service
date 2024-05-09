import { Injectable } from '@nestjs/common';
import { UpdateCommentLikeDto } from './dto/update-comment-like.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentLike } from './entities/comment-like.entity';
import { Repository } from 'typeorm';
import { CreateCommentLikeDto } from './dto/create-comment-like.dto';

@Injectable()
export class CommentLikeService {
  constructor(
    @InjectRepository(CommentLike)
    private commentLikeRepository: Repository<CommentLike>,
  ) {}
  create(createCommentLikeDto: CreateCommentLikeDto, userId: number) {
    const commentLike = this.commentLikeRepository.create({
      commentId: createCommentLikeDto.commentId,
      userId,
    });
    return this.commentLikeRepository.save(commentLike);
  }

  findAllByUserIdAndVideoId(userId: number, videoId: number) {
    return this.commentLikeRepository
      .createQueryBuilder('commentLike')
      .leftJoinAndSelect('commentLike.comment', 'comment')
      .where('comment.videoId = :videoId', { videoId })
      .andWhere('commentLike.userId = :userId', { userId })
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} commentLike`;
  }

  update(id: number, updateCommentLikeDto: UpdateCommentLikeDto) {
    return `This action updates a #${id} commentLike`;
  }

  remove(commentId: number, userId: number) {
    return this.commentLikeRepository.delete({ commentId, userId });
  }
}
