import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  url: string;

  @Column({ type: 'varchar', length: 100 })
  poster: string;

  @Column({ type: 'varchar', length: 1000 })
  introduce: string;

  @Column({ type: 'varchar', length: 512 })
  label: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateTime: Date;

  @Column({ default: 0, type: 'tinyint' })
  isDelete: boolean;

  @Column({ default: 0, type: 'int' })
  totalTime: number;

  @ManyToOne(() => User, (user) => user.videos)
  user: User;
}
