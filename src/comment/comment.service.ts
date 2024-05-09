import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  create(createCommentDto: CreateCommentDto, userId: number) {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      userId,
    });
    return this.commentRepository.save(comment);
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }

  findCountByVideoId(videoId: number) {
    return this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.videoId = :videoId', { videoId })
      .andWhere('comment.isDelete = :isDelete', { isDelete: false })
      .getCount();
  }

  async findAllByVideoId(videoId: number) {
    const data = await this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.videoId = :videoId', { videoId })
      .andWhere('comment.isDelete = :isDelete', { isDelete: false })
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.commentLike', 'commentLike')
      .orderBy('comment.createTime', 'DESC')
      .getMany();
    await Promise.all(
      data.map(async (item) => {
        item.commentCount = item.commentLike.length;
        delete item.commentLike;
        if (item.replyUserId !== 0) {
          item.replyUser = await this.userRepository.findOne({
            where: { id: item.replyUserId },
          });
        }
      }),
    );
    return data;
  }
}
