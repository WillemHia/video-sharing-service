import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Video } from '../../video/entities/video.entity';
import { CommentLike } from 'src/comment-like/entities/comment-like.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.comment)
  user: User;

  @Column()
  userId: number;

  replyUser: User;

  @Column({ nullable: true })
  replyUserId: number;

  @ManyToOne(() => Video, (video) => video.comment)
  video: Video;

  @Column()
  videoId: number;

  @ManyToOne(() => Comment, (comment) => comment.parentComment, {
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  parentComment: Comment;

  @Column({ nullable: true })
  parentId: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @Column({ default: false, select: false, type: 'boolean' })
  isDelete: boolean;

  @OneToMany(() => CommentLike, (commentLike) => commentLike.comment)
  commentLike: CommentLike[];

  commentCount: number;
}
