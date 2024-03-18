import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class Label {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createTime: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  updateTime: Date;

  @Column({ default: 0, type: 'tinyint', select: false })
  isDelete: boolean;
}
