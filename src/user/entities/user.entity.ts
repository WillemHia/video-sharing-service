import { Video } from 'src/video/entities/video.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20 })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', length: 11, default: ' ' })
  phoneNumber: string;

  @Column({ default: ' ' })
  email: string;

  @Column({
    type: 'varchar',
    length: 1000,
    default: '这个人很懒，什么都没有留下！',
  })
  introduce: string;

  @Column({ default: 'default.jpg' })
  avatar: string;

  @Column({ default: 0, type: 'tinyint' })
  sex: number;

  @Column({ default: ' ' })
  school: string;

  @Column({ default: ' ' })
  address: string;

  @Column({ default: 18, type: 'tinyint' })
  age: number;

  @Column({
    unique: true,
    type: 'varchar',
    length: 20,
  })
  userId: string;

  @Column({ default: 'default.jpg' })
  backgroundImg: string;

  @Column({
    select: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    select: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @Column({ select: false, default: false })
  isDelete: boolean;

  @OneToMany(() => Video, (video) => video.user)
  videos: Video[];
}
