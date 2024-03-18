import { Collect } from 'src/collect/entities/collect.entity';
import { Interaction } from 'src/interaction/entities/interaction.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

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

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createTime: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    select: false,
  })
  updateTime: Date;

  @Column({ default: 0, type: 'tinyint', select: false })
  isDelete: boolean;

  @Column({ default: 0, type: 'int' })
  totalTime: number;

  @Column({ type: 'int' })
  userId: number;

  @ManyToOne(() => User, (user) => user.video)
  user: User;

  @OneToMany(() => Interaction, (interaction) => interaction.video)
  interaction: Interaction[];

  @OneToMany(() => Collect, (collect) => collect.video)
  collect: Collect[];
}
