// follow-relationship.entity.ts
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class FollowRelationship {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  followedId: number;

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

  @ManyToOne(() => User, (user) => user.follows)
  user: User;

  @ManyToOne(() => User, (user) => user.followedBy)
  followedUser: User;
}
