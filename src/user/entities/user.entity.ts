import { Collect } from 'src/collect/entities/collect.entity';
import { CommentLike } from 'src/comment-like/entities/comment-like.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { FollowRelationship } from 'src/follow-relationship/entities/follow-relationship.entity';
import { Interaction } from 'src/interaction/entities/interaction.entity';
import { SearchHistory } from 'src/search-history/entities/search-history.entity';
import { Video } from 'src/video/entities/video.entity';
import { WatchHistory } from 'src/watch-history/entities/watch-history.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20 })
  username: string;

  @Column()
  password?: string;

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
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    select: false,
  })
  updateTime: Date;

  @Column({ select: false, default: false })
  isDelete: boolean;

  @OneToMany(() => Video, (video) => video.user)
  video: Video[];

  @ManyToMany(
    () => FollowRelationship,
    (followRelationship) => followRelationship.followedUser,
  )
  followedBy: FollowRelationship[];

  @ManyToMany(
    () => FollowRelationship,
    (followRelationship) => followRelationship.user,
  )
  follows: FollowRelationship[];

  @OneToMany(() => Interaction, (interaction) => interaction.user)
  interaction: Interaction[];

  @OneToMany(() => Collect, (collect) => collect.user)
  collect: Collect[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];

  @OneToMany(() => CommentLike, (commentLike) => commentLike.user)
  commentLike: CommentLike[];

  @OneToMany(() => SearchHistory, (searchHistory) => searchHistory.user)
  searchHistory: SearchHistory[];

  @OneToMany(() => WatchHistory, (watchHistory) => watchHistory.user)
  watchHistory: WatchHistory[];
}
