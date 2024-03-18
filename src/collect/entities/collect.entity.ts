import { Column, PrimaryColumn, ManyToOne, Entity } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Video } from 'src/video/entities/video.entity';

@Entity()
export class Collect {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  videoId: number;

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

  @ManyToOne(() => User, (user) => user.collect)
  user: User;

  @ManyToOne(() => Video, (video) => video.collect)
  video: Video;
}
