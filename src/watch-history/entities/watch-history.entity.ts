import { User } from 'src/user/entities/user.entity';
import { Video } from 'src/video/entities/video.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class WatchHistory {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  videoId: number;

  @Column({ type: 'float', default: 0 })
  progress: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createTime: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    select: false,
  })
  updateTime: Date;

  @ManyToOne(() => User, (user) => user.watchHistory)
  user: User;

  @ManyToOne(() => Video, (video) => video.watchHistory)
  video: Video;
}
