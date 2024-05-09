import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Comment } from '../../comment/entities/comment.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class CommentLike {
  @PrimaryColumn()
  userId: number;
  @PrimaryColumn()
  commentId: number;
  @Column({ default: () => 'CURRENT_TIMESTAMP', select: false })
  createTime: Date;
  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    select: false,
  })
  updateTime: Date;

  @ManyToOne(() => Comment, (comment) => comment.commentLike)
  comment: Comment;

  @ManyToOne(() => User, (user) => user.commentLike)
  user: User;
}
