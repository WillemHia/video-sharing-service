import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Video } from '../../video/entities/video.entity';

@Entity()
export class Interaction {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  videoId: number;

  @Column({ type: 'tinyint', default: 1 })
  interactionType: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP', select: false })
  createdTime: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    select: false,
  })
  updatedTime: Date;

  @Column({ default: 0, type: 'tinyint', select: false })
  isDeleted: number;

  @ManyToOne(() => User, (user) => user.interaction)
  user: User;

  @ManyToOne(() => Video, (video) => video.interaction)
  video: Video;
}
